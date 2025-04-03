import Joi from "joi";

const AddProductVal = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").required(),
  price: Joi.number().min(0).required(),
  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  isPopular: Joi.boolean().required(),
});

export { AddProductVal };
