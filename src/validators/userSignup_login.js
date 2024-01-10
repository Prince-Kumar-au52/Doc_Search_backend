import Joi from "joi";

const userSinupValidation = Joi.object({
  Email: Joi.string(),
  
});

export { userSinupValidation };
