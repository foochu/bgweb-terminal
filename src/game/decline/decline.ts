import { GameState, IMatchState, PlayerType } from "../../types";
import { CmdArgs, gameResult, swapTurn, showBoard } from "..";

export async function decline(args: CmdArgs): Promise<IMatchState> {
  const { state, stdout, stderr } = args;
  if (state.gameState !== GameState.Playing) {
    stderr("No game in progress (type `new game' to start one).");
    return state;
  }

  if (state.inTurn.type !== PlayerType.Human) {
    stderr(
      "It is the computer's turn -- type `play' to force it to move immediately."
    );
    return state;
  }

  if (!state.resigned) {
    stderr("No resignation was offered.");
    return state;
  }

  if (state.resigned > 0) {
    stdout(`${state.inTurn.name} declines the ${gameResult(state.resigned)}.`);
  } else {
    stdout(`${state.inTurn.name} declines the resignation`);
  }

  return showBoard(
    {
      ...swapTurn(state),
      resignationDeclined: state.resigned,
      resigned: undefined,
    },
    stdout
  );
}
