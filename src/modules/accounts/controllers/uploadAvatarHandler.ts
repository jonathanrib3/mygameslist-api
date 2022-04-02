import { Request, Response } from "express";
import { container } from "tsyringe";

import { UploadAvatarUseCase } from "../useCases/upload_avatar/UploadAvatarUseCase";

async function uploadAvatarHandler(request: Request, response: Response) {
  const { filename } = request.file;
  const { id } = request.user;

  const uploadAvatarUseCase = container.resolve(UploadAvatarUseCase);

  const update = await uploadAvatarUseCase.execute({ user_id: id, filename });

  return response
    .status(200)
    .send({ file_uploaded: update.avatar, user_id: update.id });
}

export { uploadAvatarHandler };
