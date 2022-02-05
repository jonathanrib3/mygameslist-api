import { DEFAULT_SALT } from "@shared/constants/numeric_constants";
import bcrypt from "bcrypt";

async function passwordHashProvider(
  password: string,
  salt = DEFAULT_SALT
): Promise<string> {
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

export { passwordHashProvider };
