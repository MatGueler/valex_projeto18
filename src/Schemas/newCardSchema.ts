import joi from "joi";

const newCardSchema = joi.object({
  idEmployer: joi.number().required(),
  typeCard: joi.string().required(),
});

export default newCardSchema;
