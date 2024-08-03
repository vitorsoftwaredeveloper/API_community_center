import { historic } from "../models/Historic.js";
import { communitycenter } from "../models/CommunityCenter.js";
import CommunityCenterController from "./communityCenterController.js";
import { isValidObjectId } from "mongoose";
import { verifyIfAllItemListIsPresenceOtherList } from "../utils/index.js";
import { resources } from "../constants/index.js";

class ExchangeController {
  static addResourceReceveid = (listResourceRequested, center) => {
    const resourceNotFoundInTheCenter = [];

    listResourceRequested.forEach((resourceExchange) => {
      const indexElement = center.resource.findIndex(
        (resourceCenter) => resourceCenter.item === resourceExchange.item
      );

      if (indexElement !== -1) {
        center.resource[indexElement].quantity += resourceExchange.quantity;
      } else {
        const { ["_id"]: omitted, ...res } = resourceExchange;
        resourceNotFoundInTheCenter.push(res);
      }
    });

    if (resourceNotFoundInTheCenter.length) {
      center.resource = [...center.resource, ...resourceNotFoundInTheCenter];
    }
  };

  static subtractResourceExchange = (listResourceRequested, center) => {
    listResourceRequested.forEach((resourceRequested) => {
      const indexElement = center.resource.findIndex(
        (resourceCenter) => resourceCenter.item === resourceRequested.item
      );

      if (indexElement !== -1) {
        center.resource[indexElement].quantity -= resourceRequested.quantity;

        if (center.resource[indexElement].quantity === 0) {
          center.resource.splice(indexElement, 1);
        }
      }
    });
  };

  static sumTotalPointsItemsByRequested = (itemsRequested) => {
    const listSum = [];
    itemsRequested.forEach((resource) => {
      const element = resources.find(
        (element) => element.item === resource.item
      );

      if (element) {
        listSum.push(element);
      }
    });

    return listSum.reduce((acc, resource, index) => {
      const multiplyPointsQuantity =
        resource.points * itemsRequested[index].quantity;
      return (acc += multiplyPointsQuantity);
    }, 0);
  };

  static verifyIfCenterHasQuantityAvailableItemsRequested = (
    listRequested,
    center
  ) => {
    let hasItems = true;

    listRequested.forEach((requestedResource) => {
      const searchResourceAvailable = center.resource.find(
        (resourceCenter) => resourceCenter.item === requestedResource.item
      );

      if (
        !searchResourceAvailable ||
        requestedResource.quantity > searchResourceAvailable.quantity
      ) {
        hasItems = false;
      }
    });

    return hasItems;
  };

  static verifyIfItemsExists = (centerItems) => {
    let [itemsExists, itemsNotFound] = verifyIfAllItemListIsPresenceOtherList(
      centerItems,
      resources,
      "item"
    );

    return [itemsExists, itemsNotFound];
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
      return res.status(404).send({ message: "No exists Community Center!" });
    }

    const centerTwo = await communitycenter.findById(communityCenterTwoId);

    if (!centerTwo) {
      return res.status(404).send({ message: "No exists Community Center!" });
    }

    // preciso verificar se é o mesmo id, não faz sentido fazer intercambio para o mesmo lugar

    if (communityCenterOneId === communityCenterTwoId) {
      return res.status(400).send({
        message:
          "Equal community centers! It is not permitted to exchange for the institution itself.",
      });
    }

    // preciso verificar se os itens no intercâmbio existem

    let [itemsExists, itemsNotFound] = this.verifyIfItemsExists(resourceCCOne);

    if (!itemsExists) {
      return res.status(404).send({
        message: `Community center '${centerOne.name}' does not have some of the resources for exchange. `,
        data: itemsNotFound,
      });
    }

    [itemsExists, itemsNotFound] = this.verifyIfItemsExists(resourceCCTwo);

    if (!itemsExists) {
      return res.status(404).send({
        message: `Community center '${centerTwo.name}' does not have some of the resources for exchange.`,
        data: itemsNotFound,
      });
    }

    // preciso verificar se os centros possuem a quantidade de itens solicitados na request

    let veriryIfQuantityItemsIsAvailable = true;

    veriryIfQuantityItemsIsAvailable =
      this.verifyIfCenterHasQuantityAvailableItemsRequested(
        resourceCCOne,
        centerOne
      );

    if (!veriryIfQuantityItemsIsAvailable) {
      return res.status(400).send({
        message: `Insufficient quantity of items in the community center '${centerOne.name}'.`,
      });
    }

    veriryIfQuantityItemsIsAvailable =
      this.verifyIfCenterHasQuantityAvailableItemsRequested(
        resourceCCTwo,
        centerTwo
      );

    if (!veriryIfQuantityItemsIsAvailable) {
      return res.status(400).send({
        message: `Insufficient quantity of items in the community center '${centerTwo.name}'.`,
      });
    }

    // preciso verificar se a soma dos pontos dos itens solicitados são equiparáveis

    const sumPointsExchangeCenterOne =
      this.sumTotalPointsItemsByRequested(resourceCCOne);

    const sumPointsExchangeCenterTwo =
      this.sumTotalPointsItemsByRequested(resourceCCTwo);

    // se o centro possuir sua ocupação maior que 90% ele pode efetuar o intercâmbio sem levar em consideração a soma dos pontos dos itens solicitados

    const percentageAcceptableCenterOne = Math.ceil(
      centerOne.maxNumberPeople * 0.9
    );
    const percentageAcceptableCenterTwo = Math.ceil(
      centerTwo.maxNumberPeople * 0.9
    );

    const ignoreSumPointsFromItemsIfCenterHas90PercentageOccupation =
      centerOne.quantityPeopleOccupation >= percentageAcceptableCenterOne ||
      centerTwo.quantityPeopleOccupation >= percentageAcceptableCenterTwo;

    if (sumPointsExchangeCenterOne !== sumPointsExchangeCenterTwo) {
      if (!ignoreSumPointsFromItemsIfCenterHas90PercentageOccupation) {
        return res.status(400).send({
          message: `Community center's '${centerOne.name}' and '${centerTwo.name}' they do not have comparable resources for exchange!`,
        });
      }
    }

    // decrescer a quantidade de itens que sairão o centro comunitário

    this.subtractResourceExchange(resourceCCOne, centerOne);
    this.subtractResourceExchange(resourceCCTwo, centerTwo);

    // acrescer a quantidade de itens que irão entrar no centro comunitário

    this.addResourceReceveid(resourceCCTwo, centerOne);
    this.addResourceReceveid(resourceCCOne, centerTwo);

    // atualizar o centro comunitário 1

    await CommunityCenterController.updateAllCenter(centerOne);
    await CommunityCenterController.updateAllCenter(centerTwo);

    // armazenar na tabela de histórico
    const newHistoric = new historic(req.body);

    newHistoric.save((err, itemHistoric) => {
      if (err) {
        return res.status(500).send({
          message: `${err.message} - falha ao cadastrar Centro comunitário`,
        });
      } else {
        return res.status(200).json({
          message: "Exchange carried out successfully!",
          data: itemHistoric,
        });
      }
    });
  };

  static removeItemHistoric = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Format id incorrect!" });
    }

    try {
      await historic.findByIdAndRemove(id);
      return res.status(204).send();
    } catch {
      return res.status(504).send({ mesage: "Unavailable server " });
    }
  };
}

export default ExchangeController;
