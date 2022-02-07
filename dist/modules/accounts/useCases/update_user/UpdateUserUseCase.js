"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserUseCase = void 0;
const error_messages_1 = require("@shared/constants/error_messages");
const AppError_1 = require("@shared/infra/errors/AppError");
const passwordHashProvider_1 = require("@shared/containers/providers/implementations/passwordHashProvider");
class UpdateUserUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute({ id, username, password }) {
        const userExists = await this.usersRepository.findById(id);
        if (!userExists) {
            throw new AppError_1.AppError(400, error_messages_1.UPDATE_INVALID_USER_ERROR);
        }
        if (username) {
            const usernameAlreadyExists = await this.usersRepository.findByUsername(username);
            if (usernameAlreadyExists) {
                throw new AppError_1.AppError(400, error_messages_1.USERNAME_ALREADY_EXISTS_ERROR);
            }
            if (username.length < 4 || username.length > 35) {
                throw new AppError_1.AppError(400, error_messages_1.USERNAME_LENGTH_ERROR);
            }
        }
        const hashedNewPassword = password
            ? await (0, passwordHashProvider_1.passwordHashProvider)(password)
            : undefined;
        const update = await this.usersRepository.update({
            id,
            username,
            password: hashedNewPassword,
        });
        return update;
    }
}
exports.UpdateUserUseCase = UpdateUserUseCase;
