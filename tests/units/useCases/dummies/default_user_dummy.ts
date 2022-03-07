import { User } from "@modules/accounts/models/User";

const user = new User();

Object.assign(user, {
  email: "test@mygameslist.com.br",
  password: "test123",
  username: "test-user",
  avatar: "test-avatar",
  created_at: new Date(),
  updated_at: new Date(),
});

export { user };
