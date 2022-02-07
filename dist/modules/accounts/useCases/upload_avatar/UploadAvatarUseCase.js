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
exports.UploadAvatarUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const error_messages_1 = require("@shared/constants/error_messages");
const AppError_1 = require("@shared/infra/errors/AppError");
let UploadAvatarUseCase = class UploadAvatarUseCase {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async execute({ user_id, filename }) {
        const userExists = this.usersRepository.findById(user_id);
        if (!userExists) {
            throw new AppError_1.AppError(400, error_messages_1.UPDATE_INVALID_USER_ERROR);
        }
        const update = await this.usersRepository.updateAvatar(user_id, filename);
        return update;
    }
};
UploadAvatarUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("UsersTestRepository")),
    __metadata("design:paramtypes", [Object])
], UploadAvatarUseCase);
exports.UploadAvatarUseCase = UploadAvatarUseCase;
