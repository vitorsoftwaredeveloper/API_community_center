import express from "express";
import HistoricController from "../controllers/historicController.js";

const router = express.Router();

router.get("/historic", HistoricController.listHistoricExchange);

export default router;
