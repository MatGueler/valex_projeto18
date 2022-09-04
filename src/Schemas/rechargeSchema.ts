import joi from "joi";

const rechargeSchema = joi.object({
  cardNumber: joi.number().required(),
  amount: joi.number().positive().required(),
});

export default rechargeSchema;
