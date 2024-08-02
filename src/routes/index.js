import express from "express";
import resource from "./resourceRoute.js";
import communityCenter from "./communityCenterRoute.js";
import historic from "./exchangeRoute.js";
import report from "./reportRoute.js";

const routes = (app) => {
  app.route("/").get((_, res) => {
    return res
      .status(200)
      .send({ titulo: "Centro comunitário, ajuda as nações" });
  });

  app.use(express.json(), communityCenter, resource, historic, report);
};

export default routes;
