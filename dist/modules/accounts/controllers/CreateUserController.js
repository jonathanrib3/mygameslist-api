"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateUserUseCase_1 = require("../useCases/create_user/CreateUserUseCase");
class CreateUserController {
    async handle(request, response) {
        const { username, email, password, avatar } = request.body;
        const createUserUseCase = tsyringe_1.container.resolve(CreateUserUseCase_1.CreateUserUseCase);
        const user = await createUserUseCase.execute({
            username,
            email,
            password,
            avatar,
        });
        return response.status(201).send(user);
    }
}
exports.CreateUserController = CreateUserController;
