import mongoose from "mongoose";

const historicSchema = mongoose.Schema(
  {
    id: { type: String },
    communityCenterOne: { type: String, require: true },
    communityCenterTwo: { type: String, require: true },
    dateExchange: { type: Date, default: new Date().toISOString() },
    resourceCCOne: [
      {
        quantity: { type: Number, require: true },
        refItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "resource",
          required: true,
        },
      },
    ],
    resourceCCTwo: [
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

export const historic = mongoose.model("historic", historicSchema);
