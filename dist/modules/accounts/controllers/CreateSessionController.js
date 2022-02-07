"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSessionController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateSessionUseCase_1 = require("@modules/accounts/useCases/create_session/CreateSessionUseCase");
class CreateSessionController {
    async handle(request, response) {
        const { email, password } = request.body;
        const createSessionUseCase = tsyringe_1.container.resolve(CreateSessionUseCase_1.CreateSessionUseCase);
        const token = await createSessionUseCase.execute({ email, password });
        return response.status(200).send({ token });
    }
}
exports.CreateSessionController = CreateSessionController;
