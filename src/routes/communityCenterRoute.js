import express from "express";
import CommunityCenterController from "../controllers/communityCenterController.js";

const router = express.Router();

router.get("/communitycenter", CommunityCenterController.listCommunityCenters);
router.get(
  "/communitycenter/stuffed",
  CommunityCenterController.listCommunityCentersOccupationStuffed
);
router.post("/communitycenter", CommunityCenterController.saveCommunityCenter);
router.put(
  "/communitycenter/:id",
  CommunityCenterController.updateCommunityCenter
);
router.put(
  "/update/people/:id",
  CommunityCenterController.updateQuantityPeopleCommunityCenter
);
router.delete(
  "/communitycenter/:id",
  CommunityCenterController.deleteCommunityCenter
);

export default router;
