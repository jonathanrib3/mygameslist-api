declare global {
  interface IUserToken {
    user_id: string;
  }

  interface IResetTokenInfo {
    token_id: string;
    user_id: string;
  }
}

export {};
