import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const server = express();
server.use(cors());
dotenv.config();
const PORT: number = 5000;

server.listen(() => {
  console.log("rodou rs na porta:" + PORT);
});
