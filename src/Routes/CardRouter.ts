import { Router } from "express";
import {
  ActivateCard,
  blockCard,
  CreateCard,
  statementCard,
} from "../Controllers/operacoesController";
import { validateSchema } from "../Middlewares/validateSchema";
import passwordSchema from "../Schemas/passwordSchema";

const CardRouter = Router();

CardRouter.post("/create", CreateCard);
CardRouter.post("/active", validateSchema(passwordSchema), ActivateCard);
CardRouter.get("/statement", statementCard);
CardRouter.post("/block", blockCard);

export default CardRouter;
