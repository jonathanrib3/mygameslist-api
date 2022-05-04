import { Schema } from "mongoose";

export const gameSchema = new Schema({
  _id: { type: String, minlength: 36, maxlength: 36 },
  cover: { type: String },
  title: { type: String },
  score: { type: Number },
  status: { type: String },
  involved_companies: { type: Array },
  platforms: { type: Array },
});
