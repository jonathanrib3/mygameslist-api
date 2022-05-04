interface IEmailMessageParams {
  link: string;
  username: string;
  token_secret: string;
}

export function getResetPasswordEmailTextContent({
  link,
  token_secret,
  username,
}: IEmailMessageParams): string {
  const text_data = `
  Hi there, ${username}!

  You requested our reset password service.
        
  To do so, click on the link below:
  
  ${link} 
  
  And insert your secret token: ${token_secret}
  
  This link is going to be valid for just 10 minutes, if by any chance you couldn't be able to access it, please, 
  request our reset password service again. 
  
  If this isn't you, please, ignore this message.`;

  return text_data;
}
