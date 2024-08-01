import request from "supertest";
import { afterEach, beforeEach, describe, expect, jest } from "@jest/globals";
import app from "../app";

let servidor;
let centerOneId;
let centerTwoId;
let itemHistoricId;

const DATE_INITIAL_RUN = new Date()
  .toISOString()
  .split(".")[0]
  .split("T")
  .join(" ");

const CENTER_ONE = {
  name: "Intergration Test Center 2",
  address: "example",
  localization: "example",
  maxNumberPeople: 10,
  quantityPeopleOccupation: 0,
  resource: [
    {
      quantity: 10,
      refItem: "66a930933f61b00a8261d6f4",
    },
    {
      quantity: 10,
      refItem: "66a9314e3f61b00a8261d6f8",
    },
  ],
};

const CENTER_TWO = {
  name: "Intergration Test Center 1",
  address: "example",
  localization: "example",
  maxNumberPeople: 10,
  quantityPeopleOccupation: 0,
  resource: [
    {
      quantity: 10,
      refItem: "66a930933f61b00a8261d6f4",
    },
    {
      quantity: 10,
      refItem: "66a9314e3f61b00a8261d6f8",
    },
  ],
};

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
  it("Deve ser capaz de retornar a mensagem: 'Centro Comunitário inexistente!', ao tentar realizar um intercâmbio passando um id de um centro que não existe.", async () => {
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

  it("Deve ser capaz de verificar que os id's do centros passados no intercâmbio são iguais.", async () => {
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

  it("Deve ser capaz de verificar que os recursos número [2] do centro um não está disponível no centro.", async () => {
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

  it("Deve ser capaz de verificar que os recursos número [2] do centro dois não está disponível no centro.", async () => {
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

  it("Deve ser capaz de verificar que a quantidade dos recursos número [2] de recursos ultrapassam o disponível do centro um", async () => {
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

  it("Deve ser capaz de verificar que a quantidade dos recursos número [2] de recursos ultrapassam o disponível do centro dois", async () => {
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

  it("Deve ser capaz de verificar que a soma dos pontos dos itens do centro um e centro dois diferem.", async () => {
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

  it("Deve ser capaz de verificar o intercâmbio foi realizado com sucesso.", async () => {
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

  it("Deve ser capaz de retornar mensagem de formato de datetime incorreto.", async () => {
    const response = await request(app).get(
      `/historic/${itemHistoricId}?date=${DATE_INITIAL_RUN + "R"}`
    );

    expect(response.body.message).toBe(
      "Formato de data inválido, utilize o seguinte padrão yyyy-MM-dd hh:mm:ss"
    );
  });

  //   it("Deve ser capaz de listar todos os intercâmbios que o centro um realizou.", async () => {
  //     const response = await request(app).get(
  //       `/historic/${centerOneId}?date=${DATE_INITIAL_RUN}`
  //     );

  //     expect(
  //       response.body[0].communityCenterOne || response.body[0].communityCenterTwo
  //     ).toBe(centerOneId);
  //   });

  it("Deve ser capaz de remover o item de histórico que documenta o recente intercâmbio o intercâmbio realizado pelos dois centros acima", async () => {
    await request(app).delete(`/historic/${itemHistoricId}`).expect(204);
  });
});
