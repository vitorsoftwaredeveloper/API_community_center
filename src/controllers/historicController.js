import { historic } from "../models/Historic.js";
import { communitycenter } from "../models/CommunityCenter.js";
import { resource } from "../models/Resource.js";

class HistoricController {
  static listHistoricExchange = (req, res) => {
    return historic.find((err, resource) => {
      res.status(200).json(resource);
    });
  };

  static convertObjectIdFromString = (item) => {
    return item.toString();
  };

  static updateCommunityCenter = async (center) => {
    await communitycenter
      .findOneAndUpdate({ _id: center._id }, { $set: center })
      .exec();
  };

  static makeExchangeBetweenCommunityCenter = async (req, res) => {
    // preciso verificar se os dois centros existem

    const {
      communityCenterOne: communityCenterOneId,
      communityCenterTwo: communityCenterTwoId,
      resourceCCOne,
      resourceCCTwo,
    } = req.body;

    const centerOne = await communitycenter.findById(communityCenterOneId);

    if (!centerOne) {
      return res
        .status(404)
        .send({ message: "Centro Comunitário inexistente!" });
    }

    const centerTwo = await communitycenter.findById(communityCenterTwoId);

    if (!centerTwo) {
      return res
        .status(404)
        .send({ message: "Centro Comunitário inexistente!" });
    }

    // preciso verificar se os centros possuem os recursos

    const listResourceByCommunityCenterOneIds = centerOne.resource.map((item) =>
      this.convertObjectIdFromString(item.refItem)
    );

    const listResourceExchangeOneIds = resourceCCOne.map(
      (item) => item.refItem
    );

    const listResourceByCommunityCenterTwoIds = centerTwo.resource.map((item) =>
      this.convertObjectIdFromString(item.refItem)
    );

    const listResourceExchangeTwoIds = resourceCCTwo.map(
      (item) => item.refItem
    );

    const centerOneHasItemsByExchange = listResourceExchangeOneIds.filter(
      (item) => {
        return listResourceByCommunityCenterOneIds.some(
          (resource) => resource === item
        );
      }
    );

    const centerTwoHasItemsByExchange = listResourceExchangeTwoIds.filter(
      (item) => {
        return listResourceByCommunityCenterTwoIds.some(
          (resource) => resource === item
        );
      }
    );

    if (centerOneHasItemsByExchange.length !== resourceCCOne.length) {
      return res.status(404).send({
        message: `Centro comunitário '${centerOne.name}' não possui alguns dos recursos para intercâmbio`,
      });
    }

    if (centerTwoHasItemsByExchange.length !== resourceCCTwo.length) {
      return res.status(404).send({
        message: `Centro comunitário '${centerTwo.name}' não possui alguns dos recursos para intercâmbio`,
      });
    }

    // preciso verificar se os centros possuem a quantidade de itens solicitados na request

    let veriryIfQuantityItemsIsAvailable = true;

    resourceCCOne.forEach((requestedResource) => {
      const searchResourceAvailable = centerOne.resource.find(
        (resourceCenter) =>
          this.convertObjectIdFromString(resourceCenter.refItem) ===
          requestedResource.refItem
      );

      if (requestedResource.quantity > searchResourceAvailable.quantity) {
        veriryIfQuantityItemsIsAvailable = false;
      }
    });

    if (!veriryIfQuantityItemsIsAvailable) {
      return res.status(400).send({
        message: `Quantidade insuficiente de itens centro comunitário '${centerOne.name}'`,
      });
    }

    resourceCCTwo.forEach((requestedResource) => {
      const searchResourceAvailable = centerTwo.resource.find(
        (resourceCenter) =>
          this.convertObjectIdFromString(resourceCenter.refItem) ===
          requestedResource.refItem
      );

      if (requestedResource.quantity > searchResourceAvailable.quantity) {
        veriryIfQuantityItemsIsAvailable = false;
      }
    });

    if (!veriryIfQuantityItemsIsAvailable) {
      return res.status(400).send({
        message: `Quantidade insuficiente de itens no centro comunitário '${centerTwo.name}'`,
      });
    }

    // preciso verificar se a soma dos pontos dos itens solicitados são equiparáveis

    const sumPointsExchangeCenterOne = (
      await resource.find().where("_id").in(listResourceExchangeOneIds)
    ).reduce((acc, resource, index) => {
      return (acc += resource.points * resourceCCOne[index].quantity);
    }, 0);

    const sumPointsExchangeCenterTwo = (
      await resource.find().where("_id").in(listResourceExchangeTwoIds)
    ).reduce((acc, resource, index) => {
      return (acc += resource.points * resourceCCTwo[index].quantity);
    }, 0);

    if (sumPointsExchangeCenterOne !== sumPointsExchangeCenterTwo) {
      return res.status(400).send({
        message: `Centros comunitários '${centerOne.name}' e '${centerTwo.name}' não possuem recursos equiparáveis para intercâmbio!`,
      });
    }

    // se o centro possuir sua ocupação maior que 90% da sua quantidade maxima ele pode barganhar com o outro centro com o que tem
    const occupancyPercentageOne = centerOne.quantityPeopleOccupation * 0.9;
    const occupancyPercentageTwo = centerTwo.quantityPeopleOccupation * 0.9;

    // decrescer a quantidade de itens que sairão o centro comunitário

    resourceCCOne.forEach((resourceRequested) => {
      const indexElement = centerOne.resource.findIndex(
        (resourceCenter) =>
          this.convertObjectIdFromString(resourceCenter.refItem) ===
          resourceRequested.refItem
      );

      if (indexElement !== -1) {
        centerOne.resource[indexElement].quantity -= resourceRequested.quantity;

        if (centerOne.resource[indexElement].quantity === 0) {
          centerOne.resource.splice(indexElement, 1);
        }
      }
    });

    resourceCCTwo.forEach((resourceRequested) => {
      const indexElement = centerTwo.resource.findIndex(
        (resourceCenter) =>
          this.convertObjectIdFromString(resourceCenter.refItem) ===
          resourceRequested.refItem
      );

      if (indexElement !== -1) {
        centerTwo.resource[indexElement].quantity -= resourceRequested.quantity;

        if (centerTwo.resource[indexElement].quantity === 0) {
          centerTwo.resource.splice(indexElement, 1);
        }
      }
    });

    // acrescer a quantidade de itens que irão entrar no centro comunitário

    let resourceNotFound = [];
    resourceCCTwo.forEach((resourceExchange) => {
      const indexElement = centerOne.resource.findIndex(
        (resourceCenter) =>
          this.convertObjectIdFromString(resourceCenter.refItem) ===
          resourceExchange.refItem
      );

      if (indexElement !== -1) {
        centerOne.resource[indexElement].quantity += resourceExchange.quantity;
      } else {
        const { ["_id"]: omitted, ...res } = resourceExchange;
        resourceNotFound.push(res);
      }
    });

    if (resourceNotFound.length) {
      centerOne.resource = [...centerOne.resource, ...resourceNotFound];
    }

    resourceNotFound = [];

    resourceCCOne.forEach((resourceExchange) => {
      const indexElement = centerTwo.resource.findIndex(
        (resourceCenter) =>
          this.convertObjectIdFromString(resourceCenter.refItem) ===
          resourceExchange.refItem
      );

      if (indexElement !== -1) {
        centerTwo.resource[indexElement].quantity += resourceExchange.quantity;
      } else {
        const { ["_id"]: omitted, ...res } = resourceExchange;
        resourceNotFound.push(res);
      }
    });

    if (resourceNotFound.length) {
      centerTwo.resource = [...centerTwo.resource, ...resourceNotFound];
    }

    // atualizar o centro comunitário 1

    await this.updateCommunityCenter(centerOne);
    await this.updateCommunityCenter(centerTwo);

    // armazenar na tabela de histórico
    const newHistoric = new historic(req.body);

    newHistoric.save((err) => {
      if (err) {
        return res.status(500).send({
          message: `${err.message} - falha ao cadastrar Centro comunitário`,
        });
      } else {
        return res
          .status(201)
          .send({ message: "Intercâmbio realizado com sucesso!" });
      }
    });
  };
}

export default HistoricController;
