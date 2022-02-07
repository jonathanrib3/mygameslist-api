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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSessionUseCase = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const tsyringe_1 = require("tsyringe");
const AppError_1 = require("@infra/errors/AppError");
const error_messages_1 = require("@shared/constants/error_messages");
const JwtProvider_1 = require("@shared/containers/providers/implementations/JwtProvider");
let CreateSessionUseCase = class CreateSessionUseCase {
    constructor(usersRepository, jwtProvider) {
        this.usersRepository = usersRepository;
        this.jwtProvider = jwtProvider;
    }
    async execute({ email, password }) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new AppError_1.AppError(400, error_messages_1.INVALID_LOGIN_ERROR);
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw new AppError_1.AppError(400, error_messages_1.INVALID_LOGIN_ERROR);
        }
        const token = this.jwtProvider.sign({
            data: { user_id: user.id },
        });
        return token;
    }
};
CreateSessionUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("UsersTestRepository")),
    __param(1, (0, tsyringe_1.inject)("JwtProvider")),
    __metadata("design:paramtypes", [Object, JwtProvider_1.JwtProvider])
], CreateSessionUseCase);
exports.CreateSessionUseCase = CreateSessionUseCase;