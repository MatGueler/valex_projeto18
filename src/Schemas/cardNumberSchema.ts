import joi from "joi";

const cardNumber = joi.object({
  cardNumber: joi.number().required(),
});

export default cardNumber;
