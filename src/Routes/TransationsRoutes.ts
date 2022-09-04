import { Router } from "express";
import {
  statementCard,
  rechargeCard,
  paymentCard,
} from "../Controllers/operacoesController";
import { validateSchema } from "../Middlewares/validateSchema";
import paymentSchema from "../Schemas/paymentSchema";
import rechargeSchema from "../Schemas/rechargeSchema";
import cardNumberSchema from "../Schemas/cardNumberSchema";

const CardRouter = Router();

CardRouter.get("/statement", validateSchema(cardNumberSchema), statementCard);
CardRouter.post("/recharge", validateSchema(rechargeSchema), rechargeCard);
CardRouter.post("/payment", validateSchema(paymentSchema), paymentCard);

export default CardRouter;
