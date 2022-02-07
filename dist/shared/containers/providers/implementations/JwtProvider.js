"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtProvider = void 0;
require("dotenv/config");
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = require("@infra/errors/AppError");
const error_messages_1 = require("@shared/constants/error_messages");
class JwtProvider {
    sign(data) {
        return (0, jsonwebtoken_1.sign)(data, process.env.JWT_SECRET, { expiresIn: "8h" });
    }
    decode(token) {
        try {
            const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
            return decoded;
        }
        catch (error) {
            throw new AppError_1.AppError(400, error_messages_1.INVALID_TOKEN_ERROR);
        }
    }
}
exports.JwtProvider = JwtProvider;
