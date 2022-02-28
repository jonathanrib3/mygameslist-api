import bcrypt from "bcrypt";
import crypto from "crypto";

import { TOKEN_RANDOM_BYTES } from "@shared/constants/numeric_constants";

function generateHashedToken() {
  const hashed_token_id = bcrypt.hashSync(
    crypto.randomBytes(TOKEN_RANDOM_BYTES).toString("hex"),
    Number(process.env.BCRYPT_SALT)
  );

  return hashed_token_id;
}

export { generateHashedToken };
