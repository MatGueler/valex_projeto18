import joi from "joi";

const virtualPaymentSchema = joi.object({
  cardNumber: joi.number().required(),
  cardName: joi.string().required(),
  expirateData: joi.string().required(),
  CVC: joi.number().required(),
  businessId: joi.number().required(),
  amount: joi.number().required(),
});

export default virtualPaymentSchema;
