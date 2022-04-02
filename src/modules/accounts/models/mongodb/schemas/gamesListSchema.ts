import { Schema } from "mongoose";

import { gameSchema } from "@modules/accounts/models/mongodb/schemas/gameSchema";

export const gamesListSchema = new Schema({
  _id: { type: String, minlength: 36, maxlength: 36 },
  list: [gameSchema],
});
