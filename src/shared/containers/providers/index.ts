import { container } from "tsyringe";
import { JwtProvider } from "./implementations/JwtProvider";

container.registerSingleton("JwtProvider", JwtProvider);
