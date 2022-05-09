import { Schema } from "mongoose";

import { gamesListSchema } from "@modules/games/models/mongodb/schemas/gamesListSchema";

export const userSchema = new Schema({
  _id: { type: String, minlength: 36, maxlength: 36 },
  username: { type: String, minlength: 4, maxlength: 35, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  gamesList: gamesListSchema,
  created_at: { type: Date, required: true, default: new Date() },
  updated_at: { type: Date, required: true, default: new Date() },
});
