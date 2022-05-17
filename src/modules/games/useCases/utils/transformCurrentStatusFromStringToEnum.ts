import { AppError } from "@infra/errors/AppError";
import { GameCurrentStatus } from "@modules/games/enums/index";
import { INVALID_GAME_STATUS_ERROR } from "@shared/constants/error_messages";

export function transformCurrentStatusFromStringToEnum(
  currentStatus: string
): GameCurrentStatus {
  switch (currentStatus) {
    case "plan to play":
      return GameCurrentStatus.PLAN_TO_PLAY;
    case "paused":
      return GameCurrentStatus.PAUSED;
    case "playing":
      return GameCurrentStatus.PLAYING;
    case "dropped":
      return GameCurrentStatus.DROPPED;
    case "finished":
      return GameCurrentStatus.FINISHED;
    default: {
      throw new AppError(400, INVALID_GAME_STATUS_ERROR);
    }
  }
}
