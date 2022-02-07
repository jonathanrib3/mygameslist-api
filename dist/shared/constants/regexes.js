"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_TOKEN_REGEX = exports.UUID_V4_REGEX = void 0;
const regexes = {
    UUID_V4_REGEX: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    JWT_TOKEN_REGEX: /^(?:[\w-]*\.){2}[\w-]*$/,
};
exports.UUID_V4_REGEX = regexes.UUID_V4_REGEX, exports.JWT_TOKEN_REGEX = regexes.JWT_TOKEN_REGEX;
