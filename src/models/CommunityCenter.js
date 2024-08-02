import mongoose from "mongoose";
import { z } from "zod";

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
});

const communityCenterSchema = mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, require: true },
    address: { type: String, require: true },
    localization: { type: String, require: true },
    maxNumberPeople: { type: Number, require: true },
    quantityPeopleOccupation: { type: Number, default: 0 },
    resource: [
      {
        quantity: { type: Number, require: true },
        refItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "resource",
          required: true,
        },
      },
    ],
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
    .slice(0, -2);
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
