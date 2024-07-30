import mongoose from "mongoose";

const communityCenterSchema = mongoose.Schema(
  {
    id: { type: String },
    name: { type: String, require: true },
    address: { type: String, require: true },
    localization: { type: String, require: true },
    maxNumberPeople: { type: Number, require: true },
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

export const communitycenter = mongoose.model(
  "communitycenter",
  communityCenterSchema
);
