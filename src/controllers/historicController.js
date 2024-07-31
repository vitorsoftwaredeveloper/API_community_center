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

  static addResourceReceveid = (listResourceRequested, center) => {
    const resourceNotFoundInTheCenter = [];

    listResourceRequested.forEach((resourceExchange) => {
      const indexElement = center.resource.findIndex(
        (resourceCenter) =>
          this.convertObjectIdFromString(resourceCenter.refItem) ===
          resourceExchange.refItem
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
        (resourceCenter) =>
          this.convertObjectIdFromString(resourceCenter.refItem) ===
          resourceRequested.refItem
      );

      if (indexElement !== -1) {
        center.resource[indexElement].quantity -= resourceRequested.quantity;

        if (center.resource[indexElement].quantity === 0) {
          center.resource.splice(indexElement, 1);
        }
      }
    });
  };

  static sumTotalPointsItemsByRequested = async (
    listResourceExchangeIds,
    itemsRequested
  ) => {
    return (
      await resource.find().where("_id").in(listResourceExchangeIds)
    ).reduce((acc, resource, index) => {
      return (acc += resource.points * itemsRequested[index].quantity);
    }, 0);
  };

  static verifyIfCenterHasItems = (
    listResourceExchangeIds,
    centerListResource
  ) => {
    return listResourceExchangeIds.filter((item) => {
      return centerListResource.some((resource) => resource === item);
    });
  };

  static verifyIfCenterHasQuantityAvailableItemsRequested = (
    listRequested,
    center
  ) => {
    let hasItems = true;

    listRequested.forEach((requestedResource) => {
      const searchResourceAvailable = center.resource.find(
        (resourceCenter) =>
          this.convertObjectIdFromString(resourceCenter.refItem) ===
          requestedResource.refItem
      );

      if (requestedResource.quantity > searchResourceAvailable.quantity) {
        hasItems = false;
      }
    });

    return hasItems;
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

    const centerOneHasItemsByExchange = this.verifyIfCenterHasItems(
      listResourceExchangeOneIds,
      listResourceByCommunityCenterOneIds
    );

    const centerTwoHasItemsByExchange = this.verifyIfCenterHasItems(
      listResourceExchangeTwoIds,
      listResourceByCommunityCenterTwoIds
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

    veriryIfQuantityItemsIsAvailable =
      this.verifyIfCenterHasQuantityAvailableItemsRequested(
        resourceCCOne,
        centerOne
      );

    if (!veriryIfQuantityItemsIsAvailable) {
      return res.status(400).send({
        message: `Quantidade insuficiente de itens centro comunitário '${centerOne.name}'`,
      });
    }

    veriryIfQuantityItemsIsAvailable =
      this.verifyIfCenterHasQuantityAvailableItemsRequested(
        resourceCCTwo,
        centerTwo
      );

    if (!veriryIfQuantityItemsIsAvailable) {
      return res.status(400).send({
        message: `Quantidade insuficiente de itens no centro comunitário '${centerTwo.name}'`,
      });
    }

    // preciso verificar se a soma dos pontos dos itens solicitados são equiparáveis

    const sumPointsExchangeCenterOne =
      await this.sumTotalPointsItemsByRequested(
        listResourceExchangeOneIds,
        resourceCCOne
      );

    const sumPointsExchangeCenterTwo =
      await this.sumTotalPointsItemsByRequested(
        listResourceExchangeTwoIds,
        resourceCCTwo
      );

    if (sumPointsExchangeCenterOne !== sumPointsExchangeCenterTwo) {
      return res.status(400).send({
        message: `Centros comunitários '${centerOne.name}' e '${centerTwo.name}' não possuem recursos equiparáveis para intercâmbio!`,
      });
    }

    // se o centro possuir sua ocupação maior que 90% da sua quantidade maxima ele pode barganhar com o outro centro com o que tem
    const occupancyPercentageOne = centerOne.quantityPeopleOccupation * 0.9;
    const occupancyPercentageTwo = centerTwo.quantityPeopleOccupation * 0.9;

    // decrescer a quantidade de itens que sairão o centro comunitário

    this.subtractResourceExchange(resourceCCOne, centerOne);
    this.subtractResourceExchange(resourceCCTwo, centerTwo);

    // acrescer a quantidade de itens que irão entrar no centro comunitário

    this.addResourceReceveid(resourceCCTwo, centerOne);
    this.addResourceReceveid(resourceCCOne, centerTwo);

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
