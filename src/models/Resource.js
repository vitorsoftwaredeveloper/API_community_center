import mongoose from "mongoose";

const resourceSchema = mongoose.Schema(
  {
    id: { type: String },
    item: { type: String },
    points: { type: Number },
  },
  {
    versionKey: false,
  }
);

export const resource = mongoose.model("resource", resourceSchema);
