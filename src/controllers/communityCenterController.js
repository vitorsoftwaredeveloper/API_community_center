import { isValidObjectId } from "mongoose";
import { communitycenter } from "../models/CommunityCenter.js";
import { verifyIfAllItemListIsPresenceOtherList } from "../utils/index.js";
import { resources } from "../constants/index.js";

class CommunityCenterController {
  static listCommunityCenters = async (_, res) => {
    communitycenter.find((_, communitycenter) => {
      return res.status(200).json(communitycenter);
    });
  };

  static searchCommunityById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Format id incorrect!" });
    }

    const center = await communitycenter.findById(id);

    if (!center) {
      return res
        .status(404)
        .send({ message: "Centro comunitário não encontrado!" });
    }

    return res.status(200).json(center);
  };

  static saveCommunityCenter = (req, res) => {
    const newCommunityCenter = new communitycenter(req.body);

    const [itemsExists, itemsNotFound] = verifyIfAllItemListIsPresenceOtherList(
      newCommunityCenter?.resource,
      resources,
      "item"
    );

    if (!itemsExists) {
      return res.status(404).send({
        message: "Alguns recursos não foram encontrados!",
        data: itemsNotFound,
      });
    }

    newCommunityCenter.save((err) => {
      if (err) {
        if (err?.type === "ZodError") {
          return res.status(400).send({
            message: `${err.message}`,
          });
        }

        return res.status(500).send({
          message: `${err.message}`,
        });
      } else {
        return res.status(201).send(newCommunityCenter.toJSON());
      }
    });
  };

  static updateAllCenter = async (center) => {
    await communitycenter
      .findOneAndUpdate({ _id: center._id }, { $set: center })
      .exec();
  };

  static updateCommunityCenter = (req, res) => {
    const { id } = req.params;
    const { quantityPeopleOccupation, resource } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Format id incorrect!" });
    }

    if (quantityPeopleOccupation) {
      return res.status(400).send({
        message:
          "The quantityPeopleOccupation property cannot be updated in this service, only basic information such as name, address, etc.",
      });
    }

    if (resource) {
      return res.status(400).send({
        message:
          "The resource property cannot be updated in this service, only basic information such as name, address, etc.",
      });
    }

    communitycenter.findByIdAndUpdate(id, { $set: req.body }, (err) => {
      if (err) {
        return res.status(500).send({
          message: `${err.message} - falha na atualização do Centro comunitário`,
        });
      } else {
        return res
          .status(200)
          .send({ message: "Community center successfully updated!" });
      }
    });
  };

  static updateQuantityPeopleCommunityCenter = async (req, res) => {
    const { id: idCommunity } = req.params;
    const { quantityPeopleOccupation: qtdPeopleOccupationReq } = req.body;

    const center = await communitycenter.findById(idCommunity);

    if (qtdPeopleOccupationReq <= center.maxNumberPeople) {
      communitycenter.findByIdAndUpdate(
        idCommunity,
        { $set: req.body },
        (err) => {
          if (err) {
            return res.status(500).send({
              message: `${err.message} - falha na atualização na quantidade de pessoas do Centro comunitário`,
            });
          } else {
            return communitycenter.findById(idCommunity).then((center) => {
              return res.status(200).send({
                message: `Number of occupants updated successfully, occupants: ${center.quantityPeopleOccupation}`,
              });
            });
          }
        }
      );
    } else {
      return res.status(400).send({
        message: `
        It's not possible to house that many people! This shelter has the maximum number of occupants of : ${center.maxNumberPeople} 
        people and we are currently housing ${center.quantityPeopleOccupation} pessoas. Procure outro centro comunitário!`,
      });
    }
  };

  static deleteCommunityCenter = (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Format id incorrect!" });
    }

    communitycenter.findByIdAndRemove(id, (err) => {
      if (err) {
        return res.status(500).send({
          message: `${err.message} - falha na remoção do centro comunitário`,
        });
      } else {
        return res.status(204).send();
      }
    });
  };
}

export default CommunityCenterController;
