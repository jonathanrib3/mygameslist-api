import { encrypt_cipher } from "@modules/games/useCases/utils/ciphers/encrypt_cipher";

export function encryptAccessToken(access_token: string): string {
  let encrypted_token = encrypt_cipher.update(access_token, "utf-8", "hex");
  encrypted_token += encrypt_cipher.final("hex");

  return encrypted_token;
}
