import express from "express";
import CommunityCenterController from "../controllers/communityCenterController.js";

const router = express.Router();

router.get("/communitycenter", CommunityCenterController.listCommunityCenters);
router.post("/communitycenter", CommunityCenterController.saveCommunityCenter);

export default router;
