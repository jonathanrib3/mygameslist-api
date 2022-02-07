"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadAvatarController = void 0;
const tsyringe_1 = require("tsyringe");
const UploadAvatarUseCase_1 = require("../useCases/upload_avatar/UploadAvatarUseCase");
class UploadAvatarController {
    async handle(request, response) {
        const { filename } = request.file;
        const { id } = request.user;
        const uploadAvatarUseCase = tsyringe_1.container.resolve(UploadAvatarUseCase_1.UploadAvatarUseCase);
        const update = await uploadAvatarUseCase.execute({ user_id: id, filename });
        return response.status(200).send(update);
    }
}
exports.UploadAvatarController = UploadAvatarController;
