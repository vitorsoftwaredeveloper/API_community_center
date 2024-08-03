import { resources } from "../constants/index.js";

class ResourceCenterController {
  static listResources = (_, res) => {
    return res.status(200).json(resources);
  };
}

export default ResourceCenterController;
