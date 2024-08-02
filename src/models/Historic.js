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
        refItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "resource",
          required: true,
        },
      },
    ],
    resourceCCTwo: [
      {
        quantity: { type: Number },
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

export const historic = mongoose.model("historic", historicSchema);
