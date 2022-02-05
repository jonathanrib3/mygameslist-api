import { Request, Response, Router } from "express";
import multer from "multer";

import { CreateUserController } from "@modules/accounts/controllers/CreateUserController";
import uploadConfig from "@modules/upload_config/local_upload";

const userRoutes = Router();
const createUserController = new CreateUserController();

const upload = multer(uploadConfig.upload("./tmp/avatar"));

userRoutes.post("/", createUserController.handle);

userRoutes.post(
  "/avatar",
  upload.single("avatar"),
  (req: Request, res: Response) => {
    console.log(req.file);
    res.status(200).send();
  }
);

export { userRoutes };
