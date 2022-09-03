import joi from "joi";

const passwordSchema = joi.object({
  cardNumber: joi.number().required(),
  CVC: joi.string().length(3).required(),
  password: joi.string().min(4).required(),
});

export default passwordSchema;
