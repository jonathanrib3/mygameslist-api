import bcrypt from "bcrypt";
import process from "process";

async function passwordHashProvider(
  password: string,
  salt = Number(process.env.BCRYPT_HASH)
): Promise<string> {
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

export { passwordHashProvider };
