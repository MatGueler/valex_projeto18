import { Router } from "express";
import {
  ActivateCard,
  blockCard,
  CreateCard,
  statementCard,
  unlockCard,
} from "../Controllers/operacoesController";
import { validateSchema } from "../Middlewares/validateSchema";
import passwordSchema from "../Schemas/passwordSchema";

const CardRouter = Router();

CardRouter.post("/create", CreateCard);
CardRouter.post("/active", validateSchema(passwordSchema), ActivateCard);
CardRouter.get("/statement", statementCard);
CardRouter.post("/block", blockCard);
CardRouter.post("/unlock", unlockCard);

export default CardRouter;
