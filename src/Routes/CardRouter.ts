import { Router } from "express";
import { CreateCard } from "../Controllers/operacoesController";

const CardRouter = Router();

CardRouter.get("/create", CreateCard);

export default CardRouter;
