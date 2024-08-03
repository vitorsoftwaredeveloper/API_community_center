import mongoose from "mongoose";

const historicSchema = mongoose.Schema(
  {
    id: { type: String },
    communityCenterOne: { type: String },
    communityCenterTwo: { type: String },
    dateExchange: {
      type: Date,
      default: new Date(),
    },
    resourceCCOne: [
      {
        quantity: { type: Number },
        item: { type: String },
      },
    ],
    resourceCCTwo: [
      {
        quantity: { type: Number },
        item: { type: String },
      },
    ],
  },
  {
    versionKey: false,
  }
);

export const historic = mongoose.model("historic", historicSchema);
