const DATE_INITIAL_RUN = new Date()
  .toISOString()
  .split(".")[0]
  .split("T")
  .join(" ");

const CENTER_ONE = {
  name: "Integration Test Center 2",
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
  name: "Integration Test Center 1",
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

export { CENTER_ONE, CENTER_TWO, DATE_INITIAL_RUN };
