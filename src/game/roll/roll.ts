import { GameState, IMatchState, PlayerType } from "../../types";
import { CmdArgs, rollDice } from "..";

export async function roll(args: CmdArgs): Promise<IMatchState> {
  const { state, stderr } = args;

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

  return {
    ...state,
    dice: [Math.max(dice[0], dice[1]), Math.min(dice[0], dice[1])],
    onRoll: state.inTurn,
    doubled: false,
  };
}
