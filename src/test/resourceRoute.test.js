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

  it("Should be possible to return, when searching for a resource, 'Id with invalid format', as mongodb has a standard format.", async () => {
    const response = await request(app).get(`/resource/232`).expect(400);

    expect(response.body.message).toBe("Id com formato inválido!");
  });

  it("Deve ser capaz de retornar um recurso informando o id.", async () => {
    const response = await request(app).get(
      `/resource/66a930933f61b00a8261d6f4`
    );

    expect(response.body.item).toBe("Médico");
    expect(response.body.points).toBe(4);
  });
});
