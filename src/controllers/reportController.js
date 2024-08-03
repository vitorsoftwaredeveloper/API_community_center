import { isValidObjectId } from "mongoose";
import { communitycenter } from "../models/CommunityCenter.js";
import moment from "moment-timezone";
import { historic } from "../models/Historic.js";
import { resources } from "../constants/index.js";

class ReportController {
  static listCommunityCentersOccupationStuffed = async (_, res) => {
    const listCenter = await communitycenter.find();

    return res.status(200).json(
      listCenter.filter((center) => {
        const percentageAcceptableCenter = Math.ceil(
          center.maxNumberPeople * 0.9
        );

        return center.quantityPeopleOccupation >= percentageAcceptableCenter;
      })
    );
  };

  static calcAverageItemsFromCommunityCenters = async (_, res) => {
    const listCenter = await communitycenter.find({});

    if (listCenter.length === 0) {
      return res
        .status(400)
        .send({ message: "There are no registered centers!" });
    }

    const listCenterSumPointsItems = listCenter.map((center) => {
      return center.resource;
    });

    const listItems = {};
    listCenterSumPointsItems.flat().forEach((resource) => {
      if (listItems[`${resource.item}`] === undefined) {
        listItems[`${resource.item}`] = resource.quantity;
      } else {
        listItems[`${resource.item}`] += resource.quantity;
      }
    });

    const formatListAverage = [];

    for (const [key, value] of Object.entries(listItems)) {
      const resource = resources.find((element) => key === element.item);

      formatListAverage.push({
        item: resource.item,
        average: value / listCenter.length,
      });
    }

    const formatStringResponse = formatListAverage.reduce((acc, resource) => {
      return (acc += `${Math.floor(resource.average)} ${resource.item}, `);
    }, "");

    return res
      .status(200)
      .send({ message: formatStringResponse.trim() + " per center." });
  };

  static listHistoricByCenterId = async (req, res) => {
    const { id: communityCenterId } = req.params;
    const { date } = req.query;

    if (!isValidObjectId(communityCenterId)) {
      return res.status(400).send({ message: "Format id incorrect!" });
    }

    if (isNaN(new Date(date).getFullYear())) {
      return res.status(400).send({
        message:
          "Invalid date format, use the following pattern yyyy-MM-dd hh:mm:ss",
      });
    }

    const listHistoricExchange = await historic.find({
      $or: [
        { communityCenterOne: communityCenterId },
        { communityCenterTwo: communityCenterId },
      ],
      ...(date && {
        dateExchange: {
          $gte: moment.tz(date, "America/Sao_Paulo").utc().toDate(),
          $lte: moment
            .tz(new Date().toISOString(), "America/Sao_Paulo")
            .utc()
            .toDate(),
        },
      }),
    });

    return res.status(200).json(
      listHistoricExchange.map((item) => {
        return {
          _id: item._id,
          communityCenterOne: item.communityCenterOne,
          communityCenterTwo: item.communityCenterTwo,
          dateExchange: moment(item.dateExchange)
            .tz("America/Sao_Paulo")
            .format("YYYY-MM-DDTHH:mm:ssZ"),
          resourceExchangeCenterOne: item.resourceCCOne,
          resourceExchangeCenterTwo: item.resourceCCTwo,
        };
      })
    );
  };
}

export default ReportController;
