import "@root/config.js";

import { Schema } from "mongoose";

import { resetTokenSchema } from "@modules/accounts/models/mongodb/schemas/resetTokenSchema";

export const resetSessionSchema = new Schema({
  _id: { type: String, min: 36, max: 36 },
  user_id: { type: String, min: 36, max: 36, required: true, unique: true },
  token: resetTokenSchema,
  created_at: {
    type: Date,
    required: true,
    default: new Date(),
    expires: process.env.SESSION_EXPIRATION_TIME,
  },
});
