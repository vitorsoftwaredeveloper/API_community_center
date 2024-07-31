import { communitycenter } from "../models/CommunityCenter.js";

class CommunityCenterController {
  static listCommunityCenters = async (req, res) => {
    communitycenter.find((err, communitycenter) => {
      res.status(200).json(communitycenter);
    });
  };

  static saveCommunityCenter = (req, res) => {
    const newCommunityCenter = new communitycenter(req.body);

    newCommunityCenter.save((err) => {
      if (err) {
        res.status(500).send({
          message: `${err.message} - falha ao cadastrar Centro comunitário`,
        });
      } else {
        res.status(201).send(newCommunityCenter.toJSON());
      }
    });
  };

  static updateCommunityCenter = (req, res) => {
    const { id } = req.params;

    communitycenter.findByIdAndUpdate(id, { $set: req.body }, (err) => {
      if (err) {
        res.status(500).send({
          message: `${err.message} - falha na atualização do Centro comunitário`,
        });
      } else {
        res
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
            res.status(500).send({
              message: `${err.message} - falha na atualização na quantidade de pessoas do Centro comunitário`,
            });
          } else {
            communitycenter.findById(idCommunity).then((center) => {
              res.status(200).send({
                message: `Número de ocupantes no centro comunitário: ${center.quantityPeopleOccupation}`,
              });
            });
          }
        }
      );
    } else {
      res.status(400).send({
        message: `Não é possível abrigar tantas pessoas assim! Este abrigo possui a quantidade máxima de ocupantes de : ${center.maxNumberPeople} pessoas e atualmente estamos abrigando ${center.quantityPeopleOccupation} pessoas. Procure outro centro comunitário!`,
      });
    }
  };

  static deleteCommunityCenter = (req, res) => {
    const { id } = req.params;

    communitycenter.findByIdAndRemove(id, (err) => {
      if (err) {
        res.status(500).send({
          message: `${err.message} - falha na remoção do centro comunitário`,
        });
      } else {
        res.status(204).send();
      }
    });
  };
}

export default CommunityCenterController;
