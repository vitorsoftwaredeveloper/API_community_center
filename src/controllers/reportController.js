import { communitycenter } from "../models/CommunityCenter.js";
import { resource } from "../models/Resource.js";

class ReportController {
  static listCommunityCentersOccupationStuffed = async (_, res) => {
    const listCenter = await communitycenter.find();

    return res.status(200).json(
      listCenter.filter((center) => {
        const percentageAcceptableCenter = Math.ceil(
          center.maxNumberPeople * 0.9
        );

        const percentageOccupancyCenter = Math.ceil(
          center.quantityPeopleOccupation * 0.9
        );

        return percentageOccupancyCenter >= percentageAcceptableCenter;
      })
    );
  };

  static calcAverageItemsFromCommunityCenters = async (req, res) => {
    const listCenter = await communitycenter.find({});

    if (listCenter.length === 0) {
      return res.status(400).send({ message: "Não há centros cadastrados!" });
    }

    const listItems = {};

    listCenter.forEach((center) => {
      center.resource.forEach((resource) => {
        if (listItems[`${resource.refItem}`] === undefined) {
          listItems[`${resource.refItem}`] = resource.quantity;
        } else {
          listItems[`${resource.refItem}`] += resource.quantity;
        }
      });
    });

    const listResource = await resource
      .find()
      .where("_id")
      .in(Object.keys(listItems));

    const formatListAverage = [];

    for (const [key, value] of Object.entries(listItems)) {
      const resource = listResource.find((item) => key === item._id.toString());

      formatListAverage.push({
        item: resource.item,
        average: value / listCenter.length,
      });
    }

    const formatStringResponse = formatListAverage.reduce((acc, resource) => {
      return (acc += `${resource.average.toFixed(2)} ${resource.item}, `);
    }, "");

    return res
      .status(200)
      .send({ message: formatStringResponse.trim() + " por centro." });
  };
}

export default ReportController;
