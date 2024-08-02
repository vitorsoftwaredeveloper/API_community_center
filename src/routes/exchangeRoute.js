import express from "express";
import ExchangeController from "../controllers/exchangeController.js";

const router = express.Router();

router.post("/exchange", ExchangeController.makeExchangeBetweenCommunityCenter);
router.delete("/exchange/:id", ExchangeController.removeItemHistoric);

export default router;
