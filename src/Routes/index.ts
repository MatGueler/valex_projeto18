import { Router } from "express";
import CardRouter from "./CardRouter";

const routes = Router();

routes.use(CardRouter);

export default routes;
