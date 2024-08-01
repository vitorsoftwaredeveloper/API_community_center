import request from "supertest";
import { afterEach, beforeEach, describe, expect } from "@jest/globals";
import app from "../app";

let servidor;
let centerOneId;

const CENTER_ONE = {
  name: "Integration test center suffed",
  address: "example",
  localization: "example",
  maxNumberPeople: 10,
  quantityPeopleOccupation: 9,
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
  const porta = 4000;
  servidor = app.listen(porta);

  centerOneId = (await request(app).post("/communitycenter").send(CENTER_ONE))
    .body._id;
});

afterEach(async () => {
  await request(app).delete(`/communitycenter/${centerOneId}`);

  servidor.close();
});

describe("Test router resource", () => {
  it("Deve ser capaz de retornar uma lista de todos os recursos que pontuam na realização de intercâmbio.", async () => {
    const response = await request(app).get(`/resource`);

    expect(
      response.body.map((element) => ({
        item: element.item,
        points: element.points,
      }))
    ).toMatchObject([
      { item: "Médico", points: 4 },
      { item: "Voluntário", points: 3 },
      {
        item: "Kit de suprimentos médicos",
        points: 7,
      },
      {
        item: "Veículo de transporte",
        points: 5,
      },
      { item: "Cesta básica", points: 2 },
    ]);
  });

  it("Deve ser capaz de retornar um recurso informando o id.", async () => {
    const response = await request(app).get(
      `/resource/66a930933f61b00a8261d6f4`
    );

    expect(response.body.item).toBe("Médico");
    expect(response.body.points).toBe(4);
  });
});
