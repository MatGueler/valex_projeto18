import { Router } from "express";
import CardRouter from "./CardRouter";
import TransationsRoutes from "./TransationsRoutes";

const routes = Router();

routes.use(CardRouter);
routes.use(TransationsRoutes);

export default routes;
