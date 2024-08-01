import request from "supertest";
import { afterEach, beforeEach, describe, expect, jest } from "@jest/globals";
import app from "../app";

let servidor;

beforeEach(() => {
  const porta = 3000;
  servidor = app.listen(porta);
});

afterEach(() => {
  servidor.close();
});

describe("Test router communitycenter", () => {
  it("Deve ser capaz de verificar que o endpoint de listar centro comunitários está respondendo", async () => {
    await request(servidor).get("/communitycenter").expect(200);
  });

  let idResposta = 0;

  it("Deve ser capaz de cadastrar um novo centro comunitário", async () => {
    const resposta = await request(app)
      .post("/communitycenter")
      .send({
        name: "Intergration Test Center",
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
      })
      .expect(201);

    idResposta = resposta.body._id;
  });

  it("Deve ser capaz de retornar um array de centros comunitários", async () => {
    const response = await request(servidor).get("/communitycenter");

    expect(response.body.length).toBeGreaterThan(0);
  });

  it.each([
    ["name", { name: "Centro Comunitário de Auto Ajuda" }],
    ["address", { address: "Miami" }],
  ])("Deve alterar o campo %s", async (_, param) => {
    const requisicao = { request };
    const spy = jest.spyOn(requisicao, "request");
    await requisicao
      .request(app)
      .put(`/communitycenter/${idResposta}`)
      .send(param)
      .expect(200);

    expect(spy).toHaveBeenCalled();
  });

  it("Deve ser capaz de retornar status code 400, pois o número de pessoas para ocupar o centro excede sua capacidade máxima", async () => {
    await request(app)
      .put(`/communitycenter/people/${idResposta}`)
      .send({ quantityPeopleOccupation: 12 })
      .expect(400);
  });

  it("Deve ser capaz de retornar status code 200, pois o número de pessoas para ocupar o centro não excede sua capacidade máxima", async () => {
    await request(app)
      .put(`/communitycenter/people/${idResposta}`)
      .send({ quantityPeopleOccupation: 9 })
      .expect(200);
  });

  it("Deve ser capaz de retornar o centro comunitário especificado pelo Id", async () => {
    await request(app).get(`/communitycenter/${idResposta}`).expect(200);
  });

  it("Deve ser capaz de retornar uma mensagem informando: 'Centro comunitário não encontrado!', pois o Id não foi encontrado.", async () => {
    const newId = "66ab96d5eb60314825ec455f";
    await request(app).get(`/communitycenter/${newId}`).expect(404);
  });

  it("Deletar o recurso adcionado", async () => {
    await request(app).delete(`/communitycenter/${idResposta}`).expect(204);
  });
});