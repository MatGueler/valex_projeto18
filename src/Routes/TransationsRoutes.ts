import { Router } from "express";
import {
  statementCard,
  rechargeCard,
  paymentCard,
} from "../Controllers/operacoesController";
import { validateSchema } from "../Middlewares/validateSchema";
import passwordSchema from "../Schemas/passwordSchema";
import paymentSchema from "../Schemas/paymentSchema";
import rechargeSchema from "../Schemas/rechargeSchema";

const CardRouter = Router();

CardRouter.get("/statement", statementCard);
CardRouter.post("/recharge", validateSchema(rechargeSchema), rechargeCard);
CardRouter.post("/payment", validateSchema(paymentSchema), paymentCard);

export default CardRouter;
