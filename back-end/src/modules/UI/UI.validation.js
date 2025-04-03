import Joi from "joi";

const addUIElementVal = Joi.object({
  id: Joi.string().optional(),
  footer: Joi.object({
    description: Joi.string().allow("").optional(),
  }).optional(),
  logoImage: Joi.any().optional(),
});

export { addUIElementVal };
