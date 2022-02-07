"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const CreateUserController_1 = require("@modules/accounts/controllers/CreateUserController");
const local_upload_1 = __importDefault(require("@modules/upload_config/local_upload"));
const authentication_1 = require("../middlewares/authentication");
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
const createUserController = new CreateUserController_1.CreateUserController();
const upload = (0, multer_1.default)(local_upload_1.default.upload("./tmp/avatar"));
userRoutes.post("/", createUserController.handle);
userRoutes.post("/avatar", authentication_1.authentication, upload.single("avatar"), (req, res) => {
    res.status(200).send();
});
