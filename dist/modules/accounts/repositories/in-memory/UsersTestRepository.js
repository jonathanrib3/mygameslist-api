"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersTestRepository = void 0;
const User_1 = require("@modules/accounts/models/User");
class UsersTestRepository {
    constructor() {
        this.repository = [];
    }
    async create({ email, password, username, avatar, }) {
        const user = new User_1.User();
        Object.assign(user, {
            email,
            password,
            username,
            avatar,
            created_at: new Date(),
            updated_at: new Date(),
        });
        this.repository.push(user);
        return user;
    }
    async update({ id, password, username }) {
        const user = await this.findById(id);
        user.username = username || user.username;
        user.password = password || user.password;
        return user;
    }
    async updateAvatar(user_id, avatar) {
        const user = await this.findById(user_id);
        user.avatar = avatar;
        return user;
    }
    async findById(id) {
        return this.repository.find((user) => user.id === id);
    }
    async findByEmail(email) {
        return this.repository.find((user) => user.email === email);
    }
    async findByUsername(username) {
        return this.repository.find((user) => user.username === username);
    }
}
exports.UsersTestRepository = UsersTestRepository;
