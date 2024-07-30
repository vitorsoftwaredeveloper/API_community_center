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
        res
          .status(500)
          .send({ message: `${err.message} - falha na atualização do autor` });
      } else {
        res
          .status(200)
          .send({ message: "Centro comunitárioo atualizado com sucesso" });
      }
    });
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
