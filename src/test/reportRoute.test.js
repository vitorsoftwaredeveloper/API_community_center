import request from "supertest";
import { afterEach, beforeEach, describe, expect } from "@jest/globals";
import app from "../app";
import { CENTER_ONE } from "./mock";

let servidor;
let centerOneId;

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
