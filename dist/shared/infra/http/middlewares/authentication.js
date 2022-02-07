"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const tsyringe_1 = require("tsyringe");
const AppError_1 = require("@infra/errors/AppError");
const UsersTestRepository_1 = require("@modules/accounts/repositories/in-memory/UsersTestRepository");
const error_messages_1 = require("@shared/constants/error_messages");
const JwtProvider_1 = require("@shared/containers/providers/implementations/JwtProvider");
async function authentication(request, response, next) {
    const jwtProvider = new JwtProvider_1.JwtProvider();
    const usersTestRepository = tsyringe_1.container.resolve(UsersTestRepository_1.UsersTestRepository);
    try {
        const { authorization } = request.headers;
        const [, token] = authorization.split(" ");
        const decoded = jwtProvider.decode(token);
        console.log(decoded);
        const user_exists = await usersTestRepository.findById(decoded.data.user_id);
        if (!user_exists) {
            throw new AppError_1.AppError(401, error_messages_1.USER_NOT_FOUND_ERROR);
        }
        request.user.id = user_exists.id;
        next();
    }
    catch (error) {
        throw new AppError_1.AppError(401, error_messages_1.INVALID_TOKEN_ERROR);
    }
}
exports.authentication = authentication;
