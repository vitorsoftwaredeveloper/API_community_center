import express from "express";
import ResourceController from "../controllers/resourceController.js";

const router = express.Router();

router.get("/resource", ResourceController.listResources);

export default router;
