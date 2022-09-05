import joi from "joi";

const passwordSchema = joi.object({
  cardNumber: joi.number().required(),
  password: joi.string().length(4).required(),
});

export default passwordSchema;
