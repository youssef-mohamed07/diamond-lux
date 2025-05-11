import { Product } from "../../../../DB/models/product.schema.js";
import { catchError } from "../../../MiddleWares/CatchError.js";
import { buildDiamondFilterQuery } from "./diamond.utils.js";

const getDiamondProducts = catchError(async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(80, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    // Build the filter query
    const filterQuery = buildDiamondFilterQuery(req.query);

    // Add diamond type filter if specified
    if (req.query.diamondType) {
      if (req.query.diamondType === "lab") {
        filterQuery.productType = "lab_diamond";
      } else if (req.query.diamondType === "natural") {
        filterQuery.productType = "natural_diamond";
      }
    } else {
      // If no specific type is selected, show both
      filterQuery.productType = { $in: ["lab_diamond", "natural_diamond"] };
    }

    console.log("Final Filter Query:", JSON.stringify(filterQuery, null, 2));

    let sortOptions = {};
    if (req.query.sort) {
      const [field, direction] = req.query.sort.split(":");
      sortOptions[field] = direction === "desc" ? -1 : 1;
    } else {
      sortOptions = { price: 1 };
    }

    console.log("Sort Options:", sortOptions);

    // Add search functionality
    if (req.query.search) {
      const searchTerm = req.query.search.trim();
      const searchFields = [
        "title",
        "description",
        "stockId",
        "reportNo",
        "shape",
        "col",
        "clar",
        "cut",
        "pol",
        "symm",
        "flo",
        "lab",
      ];

      // If there are existing filters, we need to combine them with the search
      if (Object.keys(filterQuery).length > 0) {
        filterQuery.$and = [
          { ...filterQuery },
          {
            $or: searchFields.map((field) => ({
              [field]: { $regex: searchTerm, $options: "i" },
            })),
          },
        ];
        // Remove the original filter query since it's now part of $and
        Object.keys(filterQuery).forEach((key) => {
          if (key !== "$and") delete filterQuery[key];
        });
      } else {
        // If no other filters, just use the search
        filterQuery.$or = searchFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        }));
      }
    }

    // Check total count first
    const totalProductsCount = await Product.countDocuments(filterQuery);
    console.log("Total Products Count:", totalProductsCount);

    if (totalProductsCount === 0) {
      console.log("No products found matching the filter criteria");
      return res.status(200).json({
        success: true,
        currentPage: page,
        totalPages: 0,
        totalProductsCount: 0,
        productsPerPage: limit,
        products: [],
      });
    }

    const products = await Product.find(filterQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    console.log(`Found ${products.length} products for current page`);

    const totalPages = Math.ceil(totalProductsCount / limit);

    if (page > totalPages && totalProductsCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Page number exceeded the max pages",
        totalPages,
        requestedPage: page,
      });
    }

    res.set({
      "X-Total-Count": totalProductsCount,
      "X-Total-Pages": totalPages,
      "X-Current-Page": page,
    });

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalProductsCount,
      productsPerPage: limit,
      products,
    });
  } catch (error) {
    console.error("Error in getDiamondProducts:", error);
    next(error);
  }
});

const getDiamondProductById = catchError(async (req, res, next) => {
  const { id } = req.params;

  // Find product and ensure it's a diamond type
  const product = await Product.findOne({
    _id: id,
    productType: { $in: ["lab_diamond", "natural_diamond"] },
  }).lean();

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Diamond product not found",
    });
  }

  return res.status(200).json({
    success: true,
    product,
  });
});

export { getDiamondProducts, getDiamondProductById };
