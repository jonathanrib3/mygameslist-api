import { container } from "tsyringe";

import { IMailProvider } from "./IMailProvider";
import { JwtProvider } from "./implementations/JwtProvider";
import { NodeMailerMailProvider } from "./implementations/NodeMailerMailProvider";

container.registerSingleton("JwtProvider", JwtProvider);
container.registerSingleton<IMailProvider>(
  "NodeMailerMailProvider",
  NodeMailerMailProvider
);
