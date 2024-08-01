import express from "express";
import HistoricController from "../controllers/historicController.js";

const router = express.Router();

router.get("/historic/:id", HistoricController.listHistoricByCenterId);
router.post("/exchange", HistoricController.makeExchangeBetweenCommunityCenter);

export default router;
