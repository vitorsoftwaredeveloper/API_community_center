import mongoose from "mongoose";

const communityCenterSchema = mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, require: true },
    address: { type: String, require: true },
    localization: { type: String, require: true },
    maxNumberPeople: { type: Int16Array, require: true },
    numberOccupationPeople: { type: Int16Array },
    resource: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "resource",
        required: true,
      },
    ],
  },
  {
    versionKey: false,
  }
);

export const communitycenter = mongoose.model(
  "communitycenter",
  communityCenterSchema
);
