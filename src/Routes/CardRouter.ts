import { Router } from "express";
import {
  ActivateCard,
  blockCard,
  CreateCard,
  statementCard,
  unlockCard,
  rechargeCard,
} from "../Controllers/operacoesController";
import { validateSchema } from "../Middlewares/validateSchema";
import passwordSchema from "../Schemas/passwordSchema";
import rechargeSchema from "../Schemas/rechargeSchema";

const CardRouter = Router();

CardRouter.post("/create", CreateCard);
CardRouter.post("/active", validateSchema(passwordSchema), ActivateCard);
CardRouter.get("/statement", statementCard);
CardRouter.post("/block", blockCard);
CardRouter.post("/unlock", unlockCard);
CardRouter.post("/recharge", validateSchema(rechargeSchema), rechargeCard);

export default CardRouter;
