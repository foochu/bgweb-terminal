import {
  GameState,
  ICheckerLayout,
  IMatchState,
  PlayerSide,
} from "../../types";
import { CmdArgs, getCurrentSide } from "..";
import { getBestMoves } from "../../api";
import { formatMove } from "../formatMove";

export async function hint(args: CmdArgs): Promise<IMatchState> {
  const { state, stderr } = args;
  if (state.gameState !== GameState.Playing) {
    stderr("No game in progress (type `new game' to start one).");
    return state;
  }

  // TODO: cube decisions

  function p(val?: number) {
    return ((val || 0) * 100).toFixed().toString();
  }

  if (state.dice) {
    // Give hint on chequer play decision
    let moves = await getBestMoves(
      state.board,
      getCurrentSide(state),
      state.dice
    );

    let opponent: ICheckerLayout;
    if (getCurrentSide(state) === PlayerSide.X) {
      opponent = state.board.o;
    } else {
      opponent = state.board.x;
    }

    for (let i = 0; i < moves.length; i++) {
      if (!moves[i].evaluation) {
        continue; // bad data
      }
      let {
        evaluation: {
          info: { cubeful, plies } = {},
          eq,
          diff,
          probability: { win, winG, winBG, lose, loseG, loseBG } = {},
        },
      } = moves[i];
      // hack, (mis)use stderr to prevent board to be drawn
      stderr(
        ` ${i + 1}. ${cubeful ? "Cubeful " : "Cubeless"} ${
          plies || 1
        }-ply   ${formatMove(moves[i], opponent).padEnd(28, " ")} Eq. ${eq} ${
          i ? `(${diff})` : ""
        }`
      );
      stderr(
        `       win: ${p(win)}% (G:${p(winG)}% BG:${p(winBG)}%) - lose: ${p(
          lose
        )}% (G:${p(loseG)}% BG:${p(loseBG)}%)`
      );
    }
    return state;
  }

  stderr("Roll dice to get a hint on chequer play decision");
  return state;
}
