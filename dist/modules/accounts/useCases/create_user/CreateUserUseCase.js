"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const error_messages_1 = require("@shared/constants/error_messages");
const AppError_1 = require("@shared/infra/errors/AppError");
const passwordHashProvider_1 = require("@shared/containers/providers/implementations/passwordHashProvider");
let CreateUserUseCase = class CreateUserUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute({ username, email, password, avatar, }) {
        const emailAlreadyBeingUsed = await this.usersRepository.findByEmail(email);
        if (emailAlreadyBeingUsed) {
            throw new AppError_1.AppError(400, error_messages_1.EMAIL_ALREADY_EXISTS_ERROR);
        }
        const usernameAlreadyBeingUsed = await this.usersRepository.findByUsername(username);
        if (usernameAlreadyBeingUsed) {
            throw new AppError_1.AppError(400, error_messages_1.USERNAME_ALREADY_EXISTS_ERROR);
        }
        if (username.length < 4 || username.length > 35) {
            throw new AppError_1.AppError(400, error_messages_1.USERNAME_LENGTH_ERROR);
        }
        const hashedPassword = await (0, passwordHashProvider_1.passwordHashProvider)(password);
        const user = await this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
            avatar,
        });
        return user;
    }
};
CreateUserUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("UsersTestRepository")),
    __metadata("design:paramtypes", [Object])
], CreateUserUseCase);
exports.CreateUserUseCase = CreateUserUseCase;
