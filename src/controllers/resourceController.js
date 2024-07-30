import { resource } from "../models/Resource.js";

class ResourceCenterController {
  static listResources = (req, res) => {
    return resource.find((err, resource) => {
      res.status(200).json(resource);
    });
  };
}

export default ResourceCenterController;
