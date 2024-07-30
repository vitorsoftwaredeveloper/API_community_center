import { communitycenter } from "../models/CommunityCenter.js";

class CommunityCenterController {
  static listCommunityCenters = (req, res) => {
    communitycenter.find((err, autor) => {
      res.status(200).json(autor);
    });
  };
}

export default CommunityCenterController;
