import { GameState, IMatchState, PlayerType } from "../../types";
import {
  CmdArgs,
  gameResult,
  getPlayerNotInTurn,
  showBoard,
  swapTurn,
} from "..";

export async function resign(args: CmdArgs): Promise<IMatchState> {
  const { argv, state, stdout, stderr } = args;
  if (state.gameState !== GameState.Playing) {
    stderr("You must be playing a game if you want to resign it.");
    return state;
  }

  if (state.inTurn.type !== PlayerType.Human) {
    stderr(
      "It is the computer's turn -- type `play' to force it to move immediately."
    );
    return state;
  }

  let resigned: number;

  if (argv[0]) {
    switch (argv[0]) {
      case "single":
      case "normal":
        resigned = 1;
        break;

      case "gammon":
        resigned = 2;
        break;

      case "bakgammon":
        resigned = 3;
        break;

      default:
        resigned = parseInt(argv[0], 10);
        break;
    }
  } else {
    resigned = 1;
  }

  if (resigned !== -1 && (resigned < 1 || resigned > 3)) {
    stderr(`Unknown keyword '${argv[0]}' (see 'help resign').`);
    return state;
  }

  let resignationDeclined = state.resignationDeclined || 0;

  if (resigned >= 0 && resigned <= resignationDeclined) {
    stderr(
      `${
        getPlayerNotInTurn(state).name
      } has already declined your offer of a ${gameResult(
        resignationDeclined
      )}.`
    );
    return state;
  }

  if (resigned > 0) {
    stdout(`${state.inTurn.name} offers to resign a ${gameResult(resigned)}.`);
  } else {
    stdout(`${state.inTurn.name} offers to resign.`);
  }

  return showBoard(
    {
      ...swapTurn(state),
      resigned,
    },
    stdout
  );
}
