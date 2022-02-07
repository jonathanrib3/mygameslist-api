"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USER_NOT_FOUND_ERROR = exports.INVALID_LOGIN_ERROR = exports.INVALID_TOKEN_ERROR = exports.UPDATE_INVALID_USER_ERROR = exports.USERNAME_LENGTH_ERROR = exports.USERNAME_ALREADY_EXISTS_ERROR = exports.EMAIL_ALREADY_EXISTS_ERROR = void 0;
const stringConstants = {
    EMAIL_ALREADY_EXISTS_ERROR: "This email is already being used by another account.",
    USERNAME_ALREADY_EXISTS_ERROR: "This username is already being used by another account.",
    USERNAME_LENGTH_ERROR: "Username length must be between 5 and 50 chars.",
    UPDATE_INVALID_USER_ERROR: "Invalid user to be updated.",
    INVALID_TOKEN_ERROR: "Invalid token.",
    INVALID_LOGIN_ERROR: "Invalid credentials",
    USER_NOT_FOUND_ERROR: "User not found",
};
exports.EMAIL_ALREADY_EXISTS_ERROR = stringConstants.EMAIL_ALREADY_EXISTS_ERROR, exports.USERNAME_ALREADY_EXISTS_ERROR = stringConstants.USERNAME_ALREADY_EXISTS_ERROR, exports.USERNAME_LENGTH_ERROR = stringConstants.USERNAME_LENGTH_ERROR, exports.UPDATE_INVALID_USER_ERROR = stringConstants.UPDATE_INVALID_USER_ERROR, exports.INVALID_TOKEN_ERROR = stringConstants.INVALID_TOKEN_ERROR, exports.INVALID_LOGIN_ERROR = stringConstants.INVALID_LOGIN_ERROR, exports.USER_NOT_FOUND_ERROR = stringConstants.USER_NOT_FOUND_ERROR;
