import request from "supertest";
import { afterEach, beforeEach, describe, expect } from "@jest/globals";
import app from "../app";
import { CENTER_ONE, DATE_INITIAL_RUN } from "./mock";

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
  it("Should be able to return a list of all centers with occupancy greater than 90%.", async () => {
    const response = await request(app).get(`/reportstuffed`);

    expect(response.body.length).toBeGreaterThan(0);
  });

  it("Should be able to return the average quantity of each resource distributed to community centers.", async () => {
    const response = await request(app).get(`/reportaverage`);

    expect(response.body.message.constructor === String).toBeTruthy();
    expect(response.body.message.includes("Médico")).toBeTruthy();
  });

  it("Should be able to return incorrect datetime format message.", async () => {
    const response = await request(app).get(
      `/reporthistoric/${centerOneId}?date=${DATE_INITIAL_RUN + "R"}`
    );

    expect(response.body.message).toBe(
      "Invalid date format, use the following pattern yyyy-MM-dd hh:mm:ss"
    );
  });
});
