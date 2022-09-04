import { Router } from "express";
import {
  ActivateCard,
  blockCard,
  CreateCard,
  unlockCard,
} from "../Controllers/operacoesController";
import { validateSchema } from "../Middlewares/validateSchema";
import newCardSchema from "../Schemas/newCardSchema";
import passwordSchema from "../Schemas/passwordSchema";
import blockAndUnlockSchema from "../Schemas/blockAndUnlockSchema";

const CardRouter = Router();

CardRouter.post("/create", validateSchema(newCardSchema), CreateCard);
CardRouter.post("/active", validateSchema(passwordSchema), ActivateCard);
CardRouter.post("/block", validateSchema(blockAndUnlockSchema), blockCard);
CardRouter.post("/unlock", validateSchema(blockAndUnlockSchema), unlockCard);

export default CardRouter;
