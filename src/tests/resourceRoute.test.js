import request from "supertest";
import { afterEach, beforeEach, describe, expect } from "@jest/globals";
import app from "../app";
import { CENTER_ONE } from "./mock";

let servidor;
let centerOneId;

beforeEach(async () => {
  const porta = 5000;
  servidor = app.listen(porta);

  centerOneId = (await request(app).post("/communitycenter").send(CENTER_ONE))
    .body._id;
});

afterEach(async () => {
  await request(app).delete(`/communitycenter/${centerOneId}`);

  servidor.close();
});

describe("Test router resource", () => {
  it("Should be able to return a list of all resources that score in exchange achievement.", async () => {
    const response = await request(app).get(`/resource`);

    expect(
      response.body.map((element) => ({
        item: element.item,
        points: element.points,
      }))
    ).toMatchObject([
      {
        item: "Kit de suprimentos médicos",
        points: 7,
      },
      {
        item: "Voluntário",
        points: 3,
      },
      {
        item: "Médico",
        points: 4,
      },
      {
        item: "Veículo de transporte",
        points: 5,
      },
      {
        item: "Cesta básica",
        points: 2,
      },
    ]);
  });
});
