import { isValidObjectId } from "mongoose";
import { communitycenter } from "../models/CommunityCenter.js";

class CommunityCenterController {
  static listCommunityCenters = async (_, res) => {
    communitycenter.find((_, communitycenter) => {
      return res.status(200).json(communitycenter);
    });
  };

  static searchCommunityById = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Id com formato inválido!" });
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

    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Id com formato inválido!" });
    }

    communitycenter.findByIdAndUpdate(id, { $set: req.body }, (err) => {
      if (err) {
        return res.status(500).send({
          message: `${err.message} - falha na atualização do Centro comunitário`,
        });
      } else {
        return res
          .status(200)
          .send({ message: "Centro comunitário atualizado com sucesso" });
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
                message: `Número de ocupantes atualizado com sucesso. Número de ocupantes: ${center.quantityPeopleOccupation}`,
              });
            });
          }
        }
      );
    } else {
      return res.status(400).send({
        message: `Não é possível abrigar tantas pessoas assim! Este abrigo possui a quantidade máxima de ocupantes de : ${center.maxNumberPeople} pessoas e atualmente estamos abrigando ${center.quantityPeopleOccupation} pessoas. Procure outro centro comunitário!`,
      });
    }
  };

  static deleteCommunityCenter = (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Id com formato inválido!" });
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
