import request from "supertest";
import { afterEach, beforeEach, describe, expect, jest } from "@jest/globals";
import app from "../app";

let servidor;
let idCenter = 0;

beforeEach(() => {
  const porta = 3000;
  servidor = app.listen(porta);
});

afterEach(() => {
  servidor.close();
});

describe("Test router communitycenter", () => {
  it("Should be able to verify that the Community Center List endpoint is responding", async () => {
    await request(servidor).get("/communitycenter").expect(200);
  });

  it("Should be able to register a new community center", async () => {
    const response = await request(app)
      .post("/communitycenter")
      .send({
        name: "Integration Test Center",
        address: "example",
        localization: "example",
        maxNumberPeople: 10,
        quantityPeopleOccupation: 0,
        resource: [
          {
            quantity: 10,
            item: "Médico",
          },
          {
            quantity: 10,
            item: "Médico",
          },
        ],
      })
      .expect(201);

    idCenter = response.body._id;
  });

  it("Should be able to return an array of community centers", async () => {
    const response = await request(servidor).get("/communitycenter");

    expect(response.body.length).toBeGreaterThan(0);
  });

  it.each([
    ["name", { name: "Centro Comunitário de Auto Ajuda" }],
    ["address", { address: "Miami" }],
  ])("Should be able to update fields %s", async (_, param) => {
    const req = { request };
    const spy = jest.spyOn(req, "request");
    await req
      .request(app)
      .put(`/communitycenter/${idCenter}`)
      .send(param)
      .expect(200);

    expect(spy).toHaveBeenCalled();
  });

  it.each([
    ["name", { name: "Centro Comunitário de Auto Ajuda" }],
    ["address", { address: "Miami" }],
  ])(
    "Should be able to return, on community center update, 'Id with invalid format' as mongodb has a default format.",
    async (_, param) => {
      const response = await request(app)
        .put(`/communitycenter/12`)
        .send(param)
        .expect(400);

      expect(response.body.message).toBe("Format id incorrect!");
    }
  );

  it("Should be able to return status code 400 as the number of people to occupy the center exceeds its maximum capacity", async () => {
    await request(app)
      .put(`/communitycenter/people/${idCenter}`)
      .send({ quantityPeopleOccupation: 12 })
      .expect(400);
  });

  it("Should be able to return that the quantityPeopleOccupation property cannot be updated.", async () => {
    const response = await request(app)
      .put(`/communitycenter/${idCenter}`)
      .send({ quantityPeopleOccupation: 12 })
      .expect(400);

    expect(response.body.message).toBe(
      "The quantityPeopleOccupation property cannot be updated in this service, only basic information such as name, address, etc."
    );
  });

  it("Should be able to return that the resource property cannot be updated.", async () => {
    const response = await request(app)
      .put(`/communitycenter/${idCenter}`)
      .send({
        resource: [
          {
            quantity: 10,
            item: "Médico",
          },
          {
            quantity: 10,
            item: "Médico",
          },
        ],
      })
      .expect(400);

    expect(response.body.message).toBe(
      "The resource property cannot be updated in this service, only basic information such as name, address, etc."
    );
  });

  it("Should be able to return status code 200 as the number of people to occupy the center does not exceed its maximum capacity", async () => {
    await request(app)
      .put(`/communitycenter/people/${idCenter}`)
      .send({ quantityPeopleOccupation: 9 })
      .expect(200);
  });

  it("Should be able to return, in the community center search, 'Id with invalid format', as mongodb has a standard format.", async () => {
    const response = await request(app).get(`/communitycenter/232`).expect(400);

    expect(response.body.message).toBe("Format id incorrect!");
  });

  it("Should be able to return the community center specified by the Id", async () => {
    await request(app).get(`/communitycenter/${idCenter}`).expect(200);
  });

  it("Should be able to return a message stating: 'Community center not found!' as the Id was not found.", async () => {
    const newId = "66ab96d5eb60314825ec455f";
    await request(app).get(`/communitycenter/${newId}`).expect(404);
  });

  it("Should be able to remove the newly created center.", async () => {
    await request(app).delete(`/communitycenter/${idCenter}`).expect(204);
  });

  it("Should be able to return, on community center removal, 'Id with invalid format' as mongodb has a default format. ", async () => {
    const response = await request(app)
      .delete(`/communitycenter/232`)
      .expect(400);

    expect(response.body.message).toBe("Format id incorrect!");
  });

  it("Should be able to remove the newly created center.", async () => {
    await request(app).delete(`/communitycenter/${idCenter}`).expect(204);
  });
});
