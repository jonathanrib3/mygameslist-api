import "@root/config.js";
import { Schema } from "mongoose";

export const resetPasswordTokenSchema = new Schema({
  _id: { type: String, min: 36, max: 36 },
  user_id: { type: String, min: 36, max: 36, required: true },
  token_secret: { type: String, required: true },
});
