import nodemailer from "nodemailer";
import { Product } from "../../../DB/models/product.schema.js";
import { Wishlist } from "../../../DB/models/wishlist.schema.js";
import { catchError } from "../../MiddleWares/CatchError.js";
import { AppError } from "../../utils/appError.js";
import { sendEmail } from "../../utils/mailer.js";
import dotenv from "dotenv";

dotenv.config();

const sendWishlistEmail = catchError(async (req, res, next) => {
  console.log("🟡 Received Wishlist Email Request:", req.body); // Debugging log

  const userId = req.session?.userId; // Ensure session exists
  let wishlistItemsHtml = "";
  let totalPrice = 0;

  let wishlist = null;

  if (userId) {
    wishlist = await Wishlist.findOne({ userId }).populate(
      "wishlistItems.product"
    );
  }

  if (wishlist && wishlist.wishlistItems.length > 0) {
    wishlistItemsHtml = wishlist.wishlistItems
      .map((item) => {
        if (item.product) {
          totalPrice += item.product.price * item.quantity;
          return `<li>${item.product.title} - Quantity: ${
            item.quantity
          } - Price: $${item.product.price.toFixed(2)}</li>`;
        }
        return "";
      })
      .join("");
  }

  const formData = req.body;
  console.log("✅ Extracted Dynamic Form Data:", formData);

  let formFieldsHtml = Object.keys(formData)
    .map((key) => {
      return `<p><strong>${key.replace(/_/g, " ")}:</strong> ${
        formData[key] || "N/A"
      }</p>`;
    })
    .join("");

  // ✅ Dynamically include wishlist only if it exists
  const wishlistSection = wishlist
    ? `<h4>Wishlist Items:</h4>
       <ul>${wishlistItemsHtml}</ul>
       <p><strong>Total Price:</strong> $${totalPrice.toFixed(2)}</p>`
    : "<p><em>No wishlist items included in this submission.</em></p>";

  const emailHtml = `
    ${wishlist ? "<h2>Wishlist Submission</h2>" : "New Quote Request"}
    ${formFieldsHtml}
    ${wishlistSection}
  `;

  console.log("📩 Email HTML Content:", emailHtml);

  // <h4>Wishlist Items:</h4>
  // <ul>${wishlistItemsHtml}</ul>
  // <p><strong>Total Price:</strong> $${wishlist.totalWishlistprice}</p>

  // Get submitter's name from form data
  const submitterName = formData.first_name || formData.name;
  
  try {
    const ownerEmail = process.env.OWNER_EMAIL;
    await sendEmail(
      ownerEmail,
      submitterName ? `New request from ${submitterName}` : "New quote request",
      emailHtml
    );
    res.json({
      message: wishlist
        ? "Wishlist sent successfully!"
        : "Quote Request sent successfully!",
    });
  } catch (error) {
    return next(new AppError("Failed to send email", 500));
  }
});

const AddToWishlist = catchError(async (req, res, next) => {
  const userId = req.session.userId;
  if (!userId)
    return next(new AppError("User ID is missing - AddToWishlist", 400));

  const product = await Product.findById(req.body.wishlistItems[0].product);
  if (!product) return next(new AppError("Product Not Found", 404));

  const wishlistItem = {
    product: req.body.wishlistItems[0].product,
    price: product.price,
    quantity: req.body.wishlistItems[0].quantity || 1,
  };

  if (wishlistItem.quantity > product.stock)
    return next(new AppError("Sold Out", 404));

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = new Wishlist({
      userId,
      wishlistItems: [wishlistItem],
      totalWishlistprice: wishlistItem.price * wishlistItem.quantity,
    });
  } else {
    const existingItem = wishlist.wishlistItems.find(
      (item) => item.product.toString() === wishlistItem.product
    );

    if (existingItem) {
      existingItem.quantity += wishlistItem.quantity;
      if (existingItem.quantity > product.stock)
        return next(new AppError("Sold Out", 404));
    } else {
      wishlist.wishlistItems.push(wishlistItem);
    }

    // Recalculate total price
    wishlist.totalWishlistprice = wishlist.wishlistItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  await wishlist.save();

  res.status(201).json({ message: "Item added to wishlist", wishlist });
});

const getUserWishlist = catchError(async (req, res, next) => {
  if (!req.session.userId) {
    return next(new AppError("User ID is missing - getUserWishlist", 400));
  }

  let wishlist = await Wishlist.findOne({ userId: req.session.userId });
  if (!wishlist) {
    // Return an empty wishlist instead of throwing an error
    return res.status(200).json({
      message: "No wishlist found for the user",
      wishlist: { wishlistItems: [], totalWishlistprice: 0 },
    });
  }

  res.status(200).json({ message: "Success", wishlist });
});

const removeItemFromWishlist = catchError(async (req, res, next) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId: req.session.userId },
    { $pull: { wishlistItems: { _id: req.params.id } } },
    { new: true }
  );

  console.log("wishlist" + wishlist);

  if (!wishlist) {
    return next(new AppError("Wishlist not found", 404));
  }

  // Recalculate total price
  wishlist.totalWishlistprice = wishlist.wishlistItems.reduce(
    (prev, item) => prev + item.quantity * item.price,
    0
  );
  await wishlist.save();

  res.status(200).json({
    message: "Item removed successfully",
    wishlist,
  });
});

const clearUserWishlist = catchError(async (req, res, next) => {
  const wishlist = await Wishlist.findOneAndDelete({
    userId: req.session.userId,
  });

  if (!wishlist) {
    return res.status(200).json({ message: "Wishlist is already empty" });
  }

  res.status(200).json({ message: "Wishlist cleared successfully" });
});

const updateWishlistItem = catchError(async (req, res, next) => {
  const { userId } = req.session;
  const { id } = req.params;
  const { quantity } = req.body;
  
  if (!userId)
    return next(new AppError("User ID is missing - updateWishlistItem", 400));
  
  if (!quantity || quantity < 1)
    return next(new AppError("Invalid quantity", 400));
  
  const wishlist = await Wishlist.findOne({ userId });
  
  if (!wishlist)
    return next(new AppError("Wishlist not found", 404));
  
  const item = wishlist.wishlistItems.id(id);
  if (!item)
    return next(new AppError("Item not found in wishlist", 404));
  
  // Check product availability
  const product = await Product.findById(item.product);
  if (!product)
    return next(new AppError("Product not found", 404));
  
  if (quantity > product.stock)
    return next(new AppError("Requested quantity exceeds available stock", 400));
  
  // Update quantity
  item.quantity = quantity;
  
  // Recalculate total price
  wishlist.totalWishlistprice = wishlist.wishlistItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  await wishlist.save();
  
  res.status(200).json({ 
    message: "Item quantity updated successfully",
    wishlist,
  });
});

export {
  AddToWishlist,
  removeItemFromWishlist,
  getUserWishlist,
  clearUserWishlist,
  sendWishlistEmail,
  updateWishlistItem
};
