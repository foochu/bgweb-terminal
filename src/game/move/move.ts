import { isLegalMove } from "../legalmoves";
import { GameState, IMatchState, IMove, PlayerType } from "../../types";
import { CmdArgs, getCurrentSide, makeMove, showBoard } from "..";
import { parseMove } from "../parsemove";

export async function move(args: CmdArgs): Promise<IMatchState> {
  const { argv, state, stdout, stderr } = args;
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

  if (!state.dice) {
    stderr("You must roll the dice before you can move.");
    return state;
  }

  if (state.resigned) {
    stderr(
      `Please wait for ${state.inTurn.name} to consider the resignation before moving.`
    );
    return state;
  }

  if (state.doubled) {
    stderr(
      `Please wait for ${state.inTurn.name} to consider the cube before moving.`
    );
    return state;
  }

  if (!argv[0]) {
    stderr(`You must specify a move (type 'help move' for instructions).`);
    return state;
  }

  let move: IMove;
  try {
    move = parseMove(argv);
  } catch (e) {
    stderr(`Error while parsing move: ${e}`);
    return state;
  }

  if (
    !(await isLegalMove(state.board, getCurrentSide(state), state.dice, move))
  ) {
    stderr("Illegal move");
    return state;
  }

  return makeMove(state, move, stdout);
}
