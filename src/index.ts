import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "express-async-errors";
import errorHandler from "./Middlewares/errorHandler";
import routes from "./Routes/index";

dotenv.config();

const server = express();
server.use(express.json());
server.use(cors());
server.use(routes);
server.use(errorHandler);

const PORT: any = process.env.PORT;
server.listen(PORT, () => {
  console.log(`It's alive on port ${PORT}`);
});
