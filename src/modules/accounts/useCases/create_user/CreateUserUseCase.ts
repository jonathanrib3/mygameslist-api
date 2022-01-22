import { AppError } from "@errors/AppError";
import { User } from "@modules/accounts/models/User";
import { passwordHashProvider } from "@modules/accounts/providers/passwordHashProvider";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { numericConstants } from "@shared/constants/numeric_constants";

interface IRequest {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

class CreateUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    username,
    email,
    password,
    avatar,
  }: IRequest): Promise<User> {
    const userAlreadyExists = this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError(
        400,
        "This email is already being used by another account."
      );
    }

    const hashedPassword = await passwordHashProvider(
      password,
      numericConstants.DEFAULT_SALT
    );

    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });

    return user;
  }
}

export { CreateUserUseCase };
