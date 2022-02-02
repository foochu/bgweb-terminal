import {
  IBoard,
  ICheckerLayout,
  ICheckerPlay,
  IMove,
  PlayerSide,
} from "../types";

export function applyMove(
  board: IBoard,
  move: IMove,
  player: PlayerSide
): IBoard {
  let ret: IBoard = JSON.parse(JSON.stringify(board));
  for (let play of move.play) {
    if (player === PlayerSide.X) {
      ret.x = applyPlay(ret.x, ret.o, play);
    } else {
      ret.o = applyPlay(ret.o, ret.x, play);
    }
  }
  return ret;
}

export function applyPlay(
  layout: ICheckerLayout,
  opponent: ICheckerLayout,
  play: ICheckerPlay
): ICheckerLayout {
  let ret: ICheckerLayout = JSON.parse(JSON.stringify(layout));

  if (play.from === "bar") {
    // coming in from the bar
    ret.bar = (ret.bar || 0) - 1 || undefined;
  } else {
    ret[play.from] = (ret[play.from] || 0) - 1 || undefined;
  }
  if (play.to === "off") {
    // bearing off
    ret.off = (ret.off || 0) + 1;
  } else {
    ret[play.to] = (ret[play.to] || 0) + 1;

    if ((opponent[25 - play.to] || 0) > 0) {
      // hit, move to bar
      opponent[25 - play.to] = 0;
      opponent.bar = (opponent.bar || 0) + 1;
    }
  }

  return ret;
}
