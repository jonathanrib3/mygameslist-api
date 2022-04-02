import { model } from "mongoose";

import { User } from "@modules/accounts/models/User";

import { userSchema } from "../schemas/userSchema";

export const UserModel = model<User>("User", userSchema);
