import { container } from "tsyringe";

import { SESMailProvider } from "@shared/containers/providers/implementations/SESMailProvider";

import { IMailProvider } from "./IMailProvider";
import { JwtProvider } from "./implementations/JwtProvider";
import { NodeMailerMailProvider } from "./implementations/NodeMailerMailProvider";

container.registerSingleton("JwtProvider", JwtProvider);

container.registerSingleton<IMailProvider>(
  "NodeMailerMailProvider",
  NodeMailerMailProvider
);

container.registerSingleton<IMailProvider>("SESMailProvider", SESMailProvider);
