"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const JwtProvider_1 = require("./implementations/JwtProvider");
tsyringe_1.container.registerSingleton("JwtProvider", JwtProvider_1.JwtProvider);
