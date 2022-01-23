import { ICheckerPlay, IMove } from "../types";

export function parseMove(a: string[]): IMove {
  let play: ICheckerPlay[] = [];

  for (let s of a) {
    let from: number | "bar";
    let to: number | "off";

    let [src, _dst] = s.split("/");
    if (["bar", "b"].indexOf(src.toLocaleLowerCase()) > -1) {
      // coming in from the bar
      from = "bar";
    } else {
      from = parseInt(src, 10);
      if (isNaN(from)) {
        throw new Error(`syntax error at '${src}'`);
      }
    }
    let [dst, _mul] = _dst.split("(");
    if (["off", "o", "-", "0"].indexOf(dst.toLocaleLowerCase()) > -1) {
      // bearing off
      to = "off";
    } else {
      to = parseInt(dst, 10);
      if (isNaN(to)) {
        throw new Error(`syntax error at '${dst}'`);
      }
    }
    let multiplier = 1;
    if (_mul) {
      let mulstr = _mul.split(")")[0];
      multiplier = parseInt(mulstr, 10);
      if (isNaN(multiplier)) {
        throw new Error(`syntax error at '${mulstr}'`);
      }
    }
    for (let j = 0; j < multiplier; j++) {
      play.push({ from, to });
    }
  }

  return { play };
}
