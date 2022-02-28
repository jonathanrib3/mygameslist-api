declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface Request {
    user: {
      id: string;
    };
    reset_token: {
      token_id: string;
      user_id: string;
    };
  }
}
