import Joi from "joi";

const AddProductVal = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().required(),
  isPopular: Joi.boolean().required(),

  // Product type validation
  productType: Joi.string().valid("diamond", "jewelry").required(),

  // Jewelry type validation (required only if productType is jewelry)
  jewelryType: Joi.string()
    .valid(
      "earrings",
      "necklace",
      "bracelet",
      "engagement_ring",
      "wedding_band"
    )
    .when("productType", {
      is: "jewelry",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),

  // Diamond-specific properties
  shape: Joi.string().when("productType", {
    is: "diamond",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  carats: Joi.number().allow("").optional(),
  col: Joi.string().allow("").optional(),
  clar: Joi.string().allow("").optional(),
  cut: Joi.string().allow("").optional(),
  pol: Joi.string().allow("").optional(),
  symm: Joi.string().allow("").optional(),
  flo: Joi.string().allow("").optional(),
  floCol: Joi.string().allow("").optional(),
  length: Joi.number().allow("").optional(),
  width: Joi.number().allow("").optional(),
  height: Joi.number().allow("").optional(),
  depth: Joi.number().allow("").optional(),
  table: Joi.number().allow("").optional(),
  culet: Joi.string().allow("").optional(),
  lab: Joi.string().allow("").optional(),
  girdle: Joi.string().allow("").optional(),
  eyeClean: Joi.string().allow("").optional(),
  brown: Joi.string().allow("").optional(),
  green: Joi.string().allow("").optional(),
  milky: Joi.string().allow("").optional(),

  // Jewelry-specific properties
  diamondType: Joi.string().valid("lab_grown", "natural").when("productType", {
    is: "jewelry",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  metal: Joi.string().when("productType", {
    is: "jewelry",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  metalColor: Joi.string().when("productType", {
    is: "jewelry",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
});

export { AddProductVal };
