import bcrypt from "bcrypt";

async function passwordHashProvider(
  password: string,
  salt: number
): Promise<string> {
  const hash = await bcrypt.hash(password, salt);

  return hash;
}

export { passwordHashProvider };
