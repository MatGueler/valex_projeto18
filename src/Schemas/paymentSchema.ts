import joi from "joi";

const paymentSchema = joi.object({
  cardNumber: joi.number().required(),
  password: joi.string().length(4).required(),
  businessId: joi.number().required(),
  amount: joi.number().positive().required(),
});

export default paymentSchema;
