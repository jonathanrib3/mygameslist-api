import "dotenv/config";

import { sign, verify } from "jsonwebtoken";

import { AppError } from "@infra/errors/AppError";
import { INVALID_TOKEN_ERROR } from "@shared/constants/error_messages";

import { ITokenData } from "./dtos/ITokenData";

class JwtProvider {
  sign<TokenPayload>(data: ITokenData<TokenPayload>): string {
    return sign(data, process.env.JWT_SECRET, { expiresIn: "8h" });
  }

  decode<TokenPayload>(token: string): ITokenData<TokenPayload> {
    try {
      const decoded = verify(
        token,
        process.env.JWT_SECRET
      ) as ITokenData<TokenPayload>;

      return decoded;
    } catch (error) {
      throw new AppError(400, INVALID_TOKEN_ERROR);
    }
  }
}

export { JwtProvider };
