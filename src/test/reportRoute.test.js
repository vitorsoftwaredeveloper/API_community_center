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

describe("Test router reports", () => {
  it("Deve ser capaz de retornar uma lista de todos os centros com ocupação maior que 90%.", async () => {
    const response = await request(app).get(`/reportstuffed`);

    expect(response.body.length).toBeGreaterThan(0);
  });

  it("Deve ser capaz de retornar a quantidade média de cada recurso distribuido nos centros comunitários.", async () => {
    const response = await request(app).get(`/reportaverage`);

    expect(response.body.message.constructor === String).toBeTruthy();
    expect(response.body.message.includes("Médico")).toBeTruthy();
    expect(
      response.body.message.includes("Kit de suprimentos médicos")
    ).toBeTruthy();
  });
});
