import "@root/config.js";

import { Schema } from "mongoose";

import { resetPasswordTokenSchema } from "@modules/accounts/models/mongodb/schemas/resetPasswordTokenSchema";

export const resetPasswordSessionSchema = new Schema({
  _id: { type: String, min: 36, max: 36 },
  user_id: { type: String, min: 36, max: 36, required: true, unique: true },
  token: resetPasswordTokenSchema,
  created_at: {
    type: Date,
    required: true,
    default: new Date(),
    expires: process.env.SESSION_EXPIRATION_TIME,
  },
});
