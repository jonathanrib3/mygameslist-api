import { Router } from "express";
import multer from "multer";

import { createUserHandler } from "@modules/accounts/controllers/createUserHandler";
import { updateUserHandler } from "@modules/accounts/controllers/updateUserHandler";
import { uploadAvatarHandler } from "@modules/accounts/controllers/uploadAvatarHandler";
import uploadConfig from "@modules/upload_config/local_upload";

import { authentication } from "../middlewares/authentication";

const userRoutes = Router();

const upload = multer(uploadConfig.upload("./tmp/avatar"));

userRoutes.post("/", createUserHandler);

userRoutes.patch("/", authentication, updateUserHandler);

userRoutes.patch(
  "/avatar",
  authentication,
  upload.single("avatar"),
  uploadAvatarHandler
);

export { userRoutes };
