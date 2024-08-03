const DATE_INITIAL_RUN = new Date()
  .toISOString()
  .split(".")[0]
  .split("T")
  .join(" ");

const CENTER_ONE = {
  name: "Integration Test Center 1",
  address: "example",
  localization: "example",
  maxNumberPeople: 10,
  quantityPeopleOccupation: 9,
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
};

const CENTER_TWO = {
  name: "Integration Test Center 2",
  address: "example",
  localization: "example",
  maxNumberPeople: 10,
  quantityPeopleOccupation: 9,
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
};

export { CENTER_ONE, CENTER_TWO, DATE_INITIAL_RUN };
