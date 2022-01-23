import { GameState, IMatchState, PlayerType } from "../../types";
import { CmdArgs, swapTurn } from "..";

export async function take(args: CmdArgs): Promise<IMatchState> {
  const { state, stdout, stderr } = args;
  if (state.gameState !== GameState.Playing || state.doubled) {
    stderr("The cube must have been offered before you can take it.");
    return state;
  }

  if (state.inTurn.type !== PlayerType.Human) {
    stderr(
      "It is the computer's turn -- type `play' to force it to move immediately."
    );
    return state;
  }

  let cube: number = state.cube || 1;
  let newCube = cube << 1;

  stdout(`${state.inTurn.name} accepts the cube at ${newCube}.`);

  return {
    ...swapTurn(state),
    cube: newCube,
    beavers: false,
    doubled: false,
    cubeOwner: state.inTurn,
  };
}
