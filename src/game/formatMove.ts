import { ICheckerLayout, ICheckerPlay, IMove } from "../types";

export function formatMove(move: IMove, opponent: ICheckerLayout) {
  interface IPlayInfo extends ICheckerPlay {
    count: number;
  }
  let play: IPlayInfo[] = move.play.slice(0).map((o) => ({ ...o, count: 1 }));

  // sort descending by source point
  play.sort(
    (a, b) =>
      (b.from === "bar" ? 25 : b.from) - (a.from === "bar" ? 25 : a.from)
  );

  // combine moves of a single chequer
  for (let i = 0; i < play.length; i++) {
    if (!play[i + 1]) {
      break;
    }
    if (play[i].to !== "off" && opponent[25 - (play[i].to as number)]) {
      // Hitting blot, keep
      continue;
    }
    if (play[i].to === play[i + 1].from) {
      play[i].to = play[i + 1].to;
      play.splice(i + 1, 1);
    }
  }

  // combine duplicates
  for (let i = 0; i < play.length; i++) {
    if (!play[i + 1]) {
      break;
    }
    if (play[i].to === play[i + 1].to && play[i].from === play[i + 1].from) {
      play[i].count++;
      play.splice(i + 1, 1);
    }
  }

  let s = "";

  for (let i = 0; i < play.length; i++) {
    if (i > 0) {
      s += " ";
    }
    s += `${play[i].from}/${play[i].to}`;
    if (play[i].count > 1) {
      s += `(${play[i].count})`;
    }
  }

  return s;
}
