import { GameState, IMatchState, PlayerType } from "../../types";
import { CmdArgs, getCurrentSide, rollDice, showBoard, swapTurn } from "..";
import { getAllMoves } from "../../api";

export async function roll(args: CmdArgs): Promise<IMatchState> {
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

  if (state.doubled) {
    stderr(
      `Please wait for ${state.inTurn.name} to consider the cube before moving.`
    );
    return state;
  }

  if (state.resigned) {
    stderr("Please resolve the resignation first.");
    return state;
  }

  if (state.dice) {
    stderr("You have already rolled the dice.");
    return state;
  }

  let dice = rollDice();

  let newState = showBoard(
    {
      ...state,
      dice: [Math.max(dice[0], dice[1]), Math.min(dice[0], dice[1])],
      onRoll: state.inTurn,
      doubled: false,
    },
    stdout
  );

  let moves = await getAllMoves(state.board, getCurrentSide(state), dice);

  if (moves.length === 0) {
    stdout(`${state.inTurn.name} cannot move.`);
    return showBoard({ ...swapTurn(newState), dice: undefined }, stdout);
  }

  return newState;
}
