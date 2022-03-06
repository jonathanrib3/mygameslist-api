import bcrypt from "bcrypt";
import { inject, injectable } from "tsyringe";

import { AppError } from "@infra/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { INVALID_LOGIN_ERROR } from "@shared/constants/error_messages";
import { JwtProvider } from "@shared/containers/providers/implementations/JwtProvider";

interface IRequest {
  email: string;
  password: string;
}

@injectable()
class CreateAuthSessionUseCase {
  constructor(
    @inject("UsersTestRepository")
    private usersRepository: IUsersRepository,
    @inject("JwtProvider")
    private jwtProvider: JwtProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<string> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(400, INVALID_LOGIN_ERROR);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError(400, INVALID_LOGIN_ERROR);
    }

    const token = this.jwtProvider.sign<IUserToken>({
      data: { user_id: user.id },
    });

    return token;
  }
}

export { CreateAuthSessionUseCase };
