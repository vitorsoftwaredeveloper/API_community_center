import express from "express";
import { DB } from "./config/dbConnect.js";

DB.on("error", console.log.bind(console, "Erro de conexão"));
DB.once("open", () => {
  console.log("Conexão com banco feita com sucesso");
});

const app = express();
app.use(express.json());

export default app;
