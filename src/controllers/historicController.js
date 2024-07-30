import { historic } from "../models/Historic.js";

class HistoricController {
  static listHistoricExchange = (req, res) => {
    return historic.find((err, resource) => {
      res.status(200).json(resource);
    });
  };
}

export default HistoricController;
