"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const UsersTestRepository_1 = require("@modules/accounts/repositories/in-memory/UsersTestRepository");
tsyringe_1.container.registerSingleton("UsersTestRepository", UsersTestRepository_1.UsersTestRepository);
