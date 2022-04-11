class ResetToken {
  id: string;

  user_id: string;

  token_secret: string;

  created_at: Date;

  expires_in?: number;
}

export { ResetToken };
