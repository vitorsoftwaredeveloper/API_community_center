import express from "express";
import ReportController from "../controllers/reportController.js";

const router = express.Router();

router.get(
  "/reportstuffed",
  ReportController.listCommunityCentersOccupationStuffed
);
router.get(
  "/reportaverage",
  ReportController.calcAverageItemsFromCommunityCenters
);

export default router;
