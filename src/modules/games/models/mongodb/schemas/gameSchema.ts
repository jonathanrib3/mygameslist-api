import { Schema } from "mongoose";

export const gameSchema = new Schema({
  _id: { type: Number },
  cover_url: { type: String },
  title: { type: String },
  genre: { type: String },
  score: { type: Number },
  status: { type: String },
  involved_companies: { type: Array },
  platforms: { type: Array },
});
