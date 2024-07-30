import express from "express";
import resource from "./resourceRoute.js";
import communityCenter from "./communityCenterRoute.js";

const routes = (app) => {
  app.route("/").get((req, res) => {
    res.status(200).send({ titulo: "Centro comunitária, ajuda as nações" });
  });

  app.use(express.json(), communityCenter, resource);
};

export default routes;
