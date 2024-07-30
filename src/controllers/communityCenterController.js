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
}

export default CommunityCenterController;
