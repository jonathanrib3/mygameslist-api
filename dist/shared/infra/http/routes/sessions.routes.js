"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRoutes = void 0;
const CreateSessionController_1 = require("@modules/accounts/controllers/CreateSessionController");
const express_1 = require("express");
const sessionRoutes = (0, express_1.Router)();
exports.sessionRoutes = sessionRoutes;
const createSessionController = new CreateSessionController_1.CreateSessionController();
sessionRoutes.post("/", createSessionController.handle);
