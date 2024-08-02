import request from "supertest";
import { afterEach, beforeEach, describe, expect } from "@jest/globals";
import app from "../app";
import { CENTER_ONE, CENTER_TWO, DATE_INITIAL_RUN } from "./mock";

let servidor;
let centerOneId;
let centerTwoId;
let itemHistoricId;

beforeEach(async () => {
  const porta = 9000;
  servidor = app.listen(porta);

  centerOneId = (await request(app).post("/communitycenter").send(CENTER_ONE))
    .body._id;

  centerTwoId = (await request(app).post("/communitycenter").send(CENTER_TWO))
    .body._id;
});

afterEach(async () => {
  await request(app).delete(`/communitycenter/${centerOneId}`);
  await request(app).delete(`/communitycenter/${centerTwoId}`);

  servidor.close();
});

describe("Test router historic", () => {
  it("Should be able to return the message: 'Community Center does not exist!', when trying to carry out an exchange by passing an ID of a center that does not exist.", async () => {
    const response = await request(app)
      .post("/exchange")
      .send({
        communityCenterOne: centerOneId,
        communityCenterTwo: "66a930933f61b00a8261d6f4",
        resourceCCOne: [
          {
            quantity: 1,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
        resourceCCTwo: [
          {
            quantity: 1,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
      });

    expect(response.body.message).toBe("Centro Comunitário inexistente!");
  });

  it("Should be able to verify that the center IDs passed in the exchange are the same.", async () => {
    const response = await request(app)
      .post("/exchange")
      .send({
        communityCenterOne: centerOneId,
        communityCenterTwo: centerOneId,
        resourceCCOne: [
          {
            quantity: 1,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
        resourceCCTwo: [
          {
            quantity: 1,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
      });

    expect(response.body.message).toBe(
      "Centros comunitários iguais! Não é permitido realizar intercâmbio para a própria instituição."
    );
  });

  it("Should be able to verify that resource number [2] from center one is not available in the center.", async () => {
    const response = await request(app)
      .post("/exchange")
      .send({
        communityCenterOne: centerOneId,
        communityCenterTwo: centerTwoId,
        resourceCCOne: [
          {
            quantity: 1,
            refItem: "66a930933f61b20a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
        resourceCCTwo: [
          {
            quantity: 1,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
      });

    expect(response.body.message).toBe(
      `Centro comunitário '${CENTER_ONE.name}' não possui alguns dos recursos para intercâmbio.`
    );
  });

  it("Should be able to verify that resource number [2] from center two is not available in center two.", async () => {
    const response = await request(app)
      .post("/exchange")
      .send({
        communityCenterOne: centerOneId,
        communityCenterTwo: centerTwoId,
        resourceCCOne: [
          {
            quantity: 1,
            refItem: "66a930933f61b20a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
        resourceCCTwo: [
          {
            quantity: 1,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00q8261d6f8",
          },
        ],
      });

    expect(response.body.message).toBe(
      `Centro comunitário '${CENTER_ONE.name}' não possui alguns dos recursos para intercâmbio.`
    );
  });

  it("Should be able to verify that the number of resources number [2] exceeds the center's available resources one", async () => {
    const response = await request(app)
      .post("/exchange")
      .send({
        communityCenterOne: centerOneId,
        communityCenterTwo: centerTwoId,
        resourceCCOne: [
          {
            quantity: 100,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 100,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
        resourceCCTwo: [
          {
            quantity: 1,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
      });

    expect(response.body.message).toBe(
      `Quantidade insuficiente de itens no centro comunitário '${CENTER_ONE.name}'.`
    );
  });

  it("Should be able to check whether the quantity of resources number [2] of resources has exceeded that available from center two", async () => {
    const response = await request(app)
      .post("/exchange")
      .send({
        communityCenterOne: centerOneId,
        communityCenterTwo: centerTwoId,
        resourceCCOne: [
          {
            quantity: 1,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
        resourceCCTwo: [
          {
            quantity: 100,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 100,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
      });

    expect(response.body.message).toBe(
      `Quantidade insuficiente de itens no centro comunitário '${CENTER_TWO.name}'.`
    );
  });

  it("Should be able to verify that the sum of the points of the items in center one and center two differ.", async () => {
    const response = await request(app)
      .post("/exchange")
      .send({
        communityCenterOne: centerOneId,
        communityCenterTwo: centerTwoId,
        resourceCCOne: [
          {
            quantity: 1,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 2,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
        resourceCCTwo: [
          {
            quantity: 1,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
      });

    expect(response.body.message).toBe(
      `Centros comunitários '${CENTER_ONE.name}' e '${CENTER_TWO.name}' não possuem recursos equiparáveis para intercâmbio!`
    );
  });

  it("Should be able to verify the exchange was carried out successfully.", async () => {
    const response = await request(app)
      .post("/exchange")
      .send({
        communityCenterOne: centerOneId,
        communityCenterTwo: centerTwoId,
        resourceCCOne: [
          {
            quantity: 1,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
        resourceCCTwo: [
          {
            quantity: 1,
            refItem: "66a930933f61b00a8261d6f4",
          },
          {
            quantity: 1,
            refItem: "66a9314e3f61b00a8261d6f8",
          },
        ],
      });

    itemHistoricId = response.body.data._id;
    expect(response.body.message).toBe("Intercâmbio realizado com sucesso!");
  });

  it("Should be possible to return, when removing the history item, 'Id with invalid format', as mongodb has a standard format.", async () => {
    const response = await request(app).delete(`/exchange/232`).expect(400);

    expect(response.body.message).toBe("Format id incorrect!");
  });

  it("Should be able to remove the history item documenting the recent exchange carried out by the above two centers.", async () => {
    await request(app).delete(`/exchange/${itemHistoricId}`).expect(204);
  });
});
