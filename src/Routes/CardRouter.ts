import { Router } from "express";
import { ActivateCard, CreateCard } from "../Controllers/operacoesController";
import { validateSchema } from "../Middlewares/validateSchema";
import passwordSchema from "../Schemas/passwordSchema";

const CardRouter = Router();

CardRouter.post("/create", CreateCard);
CardRouter.post("/active", validateSchema(passwordSchema), ActivateCard);

export default CardRouter;
