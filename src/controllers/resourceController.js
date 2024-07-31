import { resource } from "../models/Resource.js";

class ResourceCenterController {
  static listResources = (req, res) => {
    return resource.find((err, resource) => {
      res.status(200).json(resource);
    });
  };

  static listResourcesById = async (req, res) => {
    const { id } = req.params;

    const resultSearch = await resource.findById(id);

    res.status(200).json(resultSearch);
  };
}

export default ResourceCenterController;
