const regexes = {
  UUID_V4_REGEX:
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  JWT_TOKEN_REGEX: /^(?:[\w-]*\.){2}[\w-]*$/,
  EMAIL_OK_STATUS_RESPONSE_REGEX: /^(250 Accepted).*/,
};

export const {
  UUID_V4_REGEX,
  JWT_TOKEN_REGEX,
  EMAIL_OK_STATUS_RESPONSE_REGEX,
} = regexes;
