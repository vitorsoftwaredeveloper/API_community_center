import { isValidObjectId } from "mongoose";
import { communitycenter } from "../models/CommunityCenter.js";
import { resource } from "../models/Resource.js";
import moment from "moment-timezone";
import { historic } from "../models/Historic.js";

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

  static calcAverageItemsFromCommunityCenters = async (_, res) => {
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
      return (acc += `${Math.floor(resource.average)} ${resource.item}, `);
    }, "");

    return res
      .status(200)
      .send({ message: formatStringResponse.trim() + " por centro." });
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
          "Formato de data inválido, utilize o seguinte padrão yyyy-MM-dd hh:mm:ss",
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
