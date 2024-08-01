import { resource } from "../models/Resource.js";

class ResourceCenterController {
  static listResources = (req, res) => {
    return resource.find((err, resource) => {
      return res.status(200).json(resource);
    });
  };

  static listResourcesById = async (req, res) => {
    const { id } = req.params;

    const resultSearch = await resource.findById(id);

    return res.status(200).json(resultSearch);
  };
}

export default ResourceCenterController;
