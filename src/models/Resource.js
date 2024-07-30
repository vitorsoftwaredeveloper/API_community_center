import mongoose from "mongoose";

const resourceSchema = mongoose.Schema(
  {
    id: { type: String },
    item: { type: String, require: true },
    points: { type: Int8Array, require: true },
  },
  {
    versionKey: false,
  }
);

export const resource = mongoose.model("resource", resourceSchema);
