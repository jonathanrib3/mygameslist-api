import { Router } from "express";
import multer from "multer";

import { createUserHandler } from "@modules/accounts/controllers/createUserHandler";
import { UpdateUserController } from "@modules/accounts/controllers/UpdateUserController";
import { UploadAvatarController } from "@modules/accounts/controllers/UploadAvatarController";
import uploadConfig from "@modules/upload_config/local_upload";

import { authentication } from "../middlewares/authentication";

const userRoutes = Router();

const updateUserController = new UpdateUserController();
const uploadAvatarController = new UploadAvatarController();

const upload = multer(uploadConfig.upload("./tmp/avatar"));

userRoutes.post("/", createUserHandler);

userRoutes.patch("/", authentication, updateUserController.handle);

userRoutes.post(
  "/avatar",
  authentication,
  upload.single("avatar"),
  uploadAvatarController.handle
);

export { userRoutes };
