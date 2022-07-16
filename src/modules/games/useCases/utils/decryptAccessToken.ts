import { decrypt_cipher } from "@modules/games/useCases/utils/ciphers/decrypt_cipher";

function decryptAccessToken(access_token: string): string {
  let decrypted_token = decrypt_cipher.update(access_token, "hex", "utf-8");
  decrypted_token += decrypt_cipher.final("utf8");

  return decrypted_token;
}

export { decryptAccessToken };
