import { ObjectId } from "bson";

export const convertDateTimeToUTC = (date) => {
  const offsetInHours = date.getMonth() >= 10 || date.getMonth() <= 1 ? -2 : -3;
  const offsetInMinutes = offsetInHours * 60;

  date.setMinutes(date.getMinutes() - offsetInMinutes);

  return date;
};
