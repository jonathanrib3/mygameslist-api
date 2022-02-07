import { Router } from "express";
import multer from "multer";

import { CreateUserController } from "@modules/accounts/controllers/CreateUserController";
import { UploadAvatarController } from "@modules/accounts/controllers/UploadAvatarController";
import uploadConfig from "@modules/upload_config/local_upload";

import { authentication } from "../middlewares/authentication";

const userRoutes = Router();
const createUserController = new CreateUserController();
const uploadAvatarController = new UploadAvatarController();

const upload = multer(uploadConfig.upload("./tmp/avatar"));

userRoutes.post("/", createUserController.handle);

userRoutes.post(
  "/avatar",
  authentication,
  upload.single("avatar"),
  uploadAvatarController.handle
);

export { userRoutes };
