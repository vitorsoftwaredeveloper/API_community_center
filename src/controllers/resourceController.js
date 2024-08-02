import { isValidObjectId } from "mongoose";
import { resource } from "../models/Resource.js";

class ResourceCenterController {
  static listResources = (_, res) => {
    return resource.find((_, resource) => {
      return res.status(200).json(resource);
    });
  };

  static listResourcesById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Format id incorrect!" });
    }

    const resultSearch = await resource.findById(id);

    return res.status(200).json(resultSearch);
  };
}

export default ResourceCenterController;
