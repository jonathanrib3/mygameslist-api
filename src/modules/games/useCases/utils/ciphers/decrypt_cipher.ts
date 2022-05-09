import "@root/config.js";

import crypto from "crypto";

const key = Buffer.from(process.env.ACCESS_TOKEN_ENCRYPTION_KEY, "hex");

const iv = Buffer.from(process.env.ACCESS_TOKEN_ENCRYPTION_IV, "hex");

const encrypting_algorithm = process.env.ACCESS_TOKEN_ENCRYPTION_ALGORITHM;

const decrypt_cipher = crypto.createDecipheriv(encrypting_algorithm, key, iv);

export { decrypt_cipher };
