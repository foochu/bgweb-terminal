import { computerTurn } from "../computerturn";
import { GameState, IMatchState, PlayerType } from "../../types";
import { CmdArgs } from "..";

export async function play(args: CmdArgs): Promise<IMatchState> {
  const { state, stdout, stderr } = args;
  if (state.gameState !== GameState.Playing) {
    stderr("No game in progress (type `new game' to start one).");
    return state;
  }

  if (state.inTurn.type === PlayerType.Human) {
    stderr("It's not the computer's turn to play.");
    return state;
  }

  return await computerTurn(state, stdout, stderr);
}
