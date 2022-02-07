"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const uuid_1 = require("uuid");
class User {
    constructor() {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
            this.gamesList = {
                id: (0, uuid_1.v4)(),
                list: [],
            };
        }
        this.admin = false;
    }
}
exports.User = User;
