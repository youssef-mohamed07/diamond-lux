import { Product } from "../../../../../DB/models/product.schema.js";
import { catchError } from "../../../../MiddleWares/CatchError.js";
import { buildJeweleryFilterQuery } from "../jewelery.utils.js";

const getEngagement_RingProducts = catchError(async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    const filterQuery = buildJeweleryFilterQuery(req.query);
    filterQuery.jewelryType = "engagement_ring";

    let sortOptions = {};
    if (req.query.sort) {
      const [field, direction] = req.query.sort.split(":");
      sortOptions[field] = direction === "desc" ? -1 : 1;
    } else {
      sortOptions = { price: 1 };
    }

    const [totalProductsCount, products] = await Promise.all([
      Product.countDocuments(filterQuery),
      Product.aggregate([
        { $match: filterQuery },
        { $sort: sortOptions },
        { $skip: skip },
        { $limit: limit },
      ]).option({ allowDiskUse: true }),
    ]);

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
    next(error);
  }
});

export { getEngagement_RingProducts };

