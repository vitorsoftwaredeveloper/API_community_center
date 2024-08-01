import express from "express";
import CommunityCenterController from "../controllers/communityCenterController.js";

const router = express.Router();

router.get("/communitycenter", CommunityCenterController.listCommunityCenters);
router.get(
  "/communitycenter/:id",
  CommunityCenterController.searchCommunityById
);
router.post("/communitycenter", CommunityCenterController.saveCommunityCenter);
router.put(
  "/communitycenter/:id",
  CommunityCenterController.updateCommunityCenter
);
router.put(
  "/communitycenter/people/:id",
  CommunityCenterController.updateQuantityPeopleCommunityCenter
);

router.delete(
  "/communitycenter/:id",
  CommunityCenterController.deleteCommunityCenter
);

export default router;
