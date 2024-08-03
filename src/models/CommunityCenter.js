import mongoose from "mongoose";
import { z } from "zod";
import { resources } from "../constants/index.js";

const resourceSchemaZod = z.object({
  item: z.string({
    required_error: "Field item is required in the resource list",
  }),
  quantity: z
    .number({
      required_error: "Field quantity is required in the resource list",
    })
    .int()
    .nonnegative("quantity item must be a non-negative number"),
});

const communitySchemaZod = z.object({
  name: z.string({ required_error: "Field name is required" }),
  address: z.string({ required_error: "Field address is required" }),
  localization: z.string({
    required_error: "Field localization is required",
  }),
  maxNumberPeople: z.number({
    required_error: "Field maxNumberPeople is required",
  }),
  quantityPeopleOccupation: z
    .number()
    .int()
    .nonnegative("quantityPeopleOccupation must be a non-negative number"),
  resource: z.array(resourceSchemaZod),
});

const communityCenterSchema = mongoose.Schema(
  {
    id: { type: String },
    name: { type: String },
    address: { type: String },
    localization: { type: String },
    maxNumberPeople: { type: Number },
    quantityPeopleOccupation: { type: Number, default: 0 },
    resource: {
      type: Array,
      default: resources.map((element) => ({
        name: element.item,
        quantity: 0,
      })),
    },
  },
  {
    versionKey: false,
  }
);

const formatResponseErrorValidate = (error) => {
  return error
    .reduce((acc, error) => {
      return (acc += error.message + " / ");
    }, "")
    .slice(0, -3);
};

communityCenterSchema.pre("save", function (next) {
  const comunity = this;

  const result = communitySchemaZod.safeParse(comunity.toObject());
  if (!result.success) {
    const error = new Error("");
    error.type = "ZodError";
    error.message = formatResponseErrorValidate(result.error.errors);

    return next(error);
  }
  next();
});

export const communitycenter = mongoose.model(
  "communitycenter",
  communityCenterSchema
);
