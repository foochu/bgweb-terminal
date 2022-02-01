import { getBestMoves } from "../api";
import { getCurrentSide, makeMove, rollDice, showBoard, swapTurn } from ".";
import { take } from "./take/take";
import { GameState, IMatchState, PlayerType, STDIO } from "../types";
import { formatMove } from "./formatMove";

export async function computerTurn(
  state: Readonly<IMatchState>,
  stdout: STDIO,
  stderr: STDIO
): Promise<IMatchState> {
  if (state.gameState !== GameState.Playing) {
    throw new Error("no game in progress");
  }

  if (state.inTurn.type !== PlayerType.Computer) {
    throw new Error("not computers turn");
  }

  // ***********************************************
  // Resignition offered?
  // ***********************************************

  if (state.resigned) {
    // TODO: just always decline for now
    stdout(`${state.inTurn.name} declines the resignation`);
    return {
      ...swapTurn(state),
      resignationDeclined: state.resigned,
      resigned: undefined,
    };
  }

  // ***********************************************
  // Cube offered?
  // ***********************************************

  if (state.doubled) {
    // TODO: just take any cube offered
    return take({ argv: [], state, stdout, stderr });
  }

  // ***********************************************
  // Consider resignition
  // ***********************************************

  // TODO

  // ***********************************************
  // Consider doubling
  // ***********************************************

  // TODO

  // ***********************************************
  // Roll dice and move
  // ***********************************************

  let { dice } = state;

  if (!dice) {
    dice = rollDice();
    dice = [Math.max(dice[0], dice[1]), Math.min(dice[0], dice[1])];
  }

  // show state after roll
  state = showBoard({ ...state, dice }, stdout);

  let moves = await getBestMoves(state.board, getCurrentSide(state), dice);

  if (moves.length === 0) {
    stdout(`${state.inTurn.name} cannot move.`);
    return { ...swapTurn(state), dice: undefined };
  }

  // make the best move
  let move = moves[0];

  stdout(`${state.inTurn.name} moves ${formatMove(move, state.board.x)}.`);

  return makeMove(state, move, stdout);
}
