import { IBoard, ICheckerLayout, PlayerSide, STDIO } from "../types";
import { positionIdFromBoard } from "./positionid";

const achX = "     X6789ABCDEF";
const achO = "     O6789ABCDEF";

/*
 *  BGWeb Terminal  Position ID: 0123456789ABCD
 *      O: cpu [25] (Cube: 2) - 0/7 points
 *  +13-14-15-16-17-18------19-20-21-22-23-24-+
 *  |                  |   | O  O  O  O     O | OO
 *  |                  |   | O     O          | OO
 *  |                  |   |       O          | O
 *  |                  |   |                  | O
 *  |                  |   |                  | O
 * v|                  |BAR|   X Rolled 11    |
 *  |                  |   |                  | X
 *  |                  |   |                  | X
 *  |                  |   |                  | X
 *  |                  |   |       X  X  X  X | X
 *  |                  |   |    X  X  X  X  X | XX
 *  +12-11-10--9--8--7-------6--5--4--3--2--1-+
 *     X: chuck [25] (Cube: 2) - 0/7 points
 */

type GameInfo = {
  X: PlayerInfo;
  O: PlayerInfo;
  cube?: number;
  matchTo?: number;
};

type PlayerInfo = {
  name: string;
  points: number;
  roll?: string;
  cube?: number;
};

export function drawBoard(
  stdout: STDIO,
  board: IBoard,
  onRoll: PlayerSide,
  info: GameInfo
): void {
  let cOffO = board.o.off || 0,
    cOffX = board.x.off || 0;

  (function () {
    let line = " BGWeb Terminal  Position ID: ";

    if (onRoll === PlayerSide.X) {
      line += positionIdFromBoard(board);
    } else {
      let swapped: IBoard = {
        x: board.o,
        o: board.x,
      };
      line += positionIdFromBoard(swapped);
    }

    stdout(line);
  })();

  stdout(formatPlayerInfo(info.O, "O", info, countPips(board.x)));

  (function () {
    let line =
      onRoll === PlayerSide.X
        ? " +13-14-15-16-17-18------19-20-21-22-23-24-+     "
        : " +12-11-10--9--8--7-------6--5--4--3--2--1-+     ";

    stdout(line);
  })();

  (function () {
    for (let y = 0; y < 4; y++) {
      let x = 0;
      let line = " |";

      for (x = 13; x < 19; x++) {
        line += " ";
        line +=
          (board.x[x] || 0) > y ? "X" : (board.o[25 - x] || 0) > y ? "O" : " ";
        line += " ";
      }
      line += "| ";
      line += (board.o.bar || 0) > y ? "O" : " ";
      line += " |";
      for (; x < 25; x++) {
        line += " ";
        line +=
          (board.x[x] || 0) > y ? "X" : (board.o[25 - x] || 0) > y ? "O" : " ";
        line += " ";
      }
      line += "| ";
      for (x = 0; x < 3; x++) {
        line += cOffO > 5 * x + y ? "O" : " ";
      }
      line += " ";

      stdout(line);
    }
  })();

  (function () {
    let line = " |";
    let x = 0;

    for (x = 13; x < 19; x++) {
      line += " ";
      line += board.x[x]
        ? achX[board.x[x] as number]
        : achO[board.o[25 - x] || 0];
      line += " ";
    }

    line += "| ";
    line += achO[board.o.bar || 0];
    line += " |";

    for (; x < 25; x++) {
      line += " ";
      line += board.x[x]
        ? achX[board.x[x] as number]
        : achO[board.o[25 - x] || 0];
      line += " ";
    }

    line += "| ";

    for (x = 0; x < 3; x++) {
      line += cOffO > 5 * x + 4 ? "O" : " ";
    }

    line += " ";

    stdout(line);
  })();

  (function () {
    let line = onRoll === PlayerSide.X ? "v" : "^";

    line += "|";

    if (info.O.roll) {
      line += centerText(info.O.roll, 18);
    } else {
      line += "".padEnd(18);
    }

    line += "|BAR|";

    if (info.X.roll) {
      line += centerText(info.X.roll, 18);
    } else {
      line += "".padEnd(18);
    }

    line += "|     ";

    stdout(line);
  })();

  (function () {
    let line = " |";
    let x = 0;

    for (x = 12; x > 6; x--) {
      line += " ";
      line += board.x[x]
        ? achX[board.x[x] as number]
        : achO[board.o[25 - x] || 0];
      line += " ";
    }

    line += "| ";
    line += achX[board.x.bar || 0];
    line += " |";

    for (; x > 0; x--) {
      line += " ";
      line += board.x[x]
        ? achX[board.x[x] as number]
        : achO[board.o[25 - x] || 0];
      line += " ";
    }

    line += "| ";

    for (x = 0; x < 3; x++) {
      line += cOffX > 5 * x + 4 ? "X" : " ";
    }

    line += " ";
    stdout(line);
  })();

  (function () {
    for (let y = 3; y > -1; y--) {
      let line = " |";
      let x = 0;

      for (x = 12; x > 6; x--) {
        line += " ";
        line +=
          (board.x[x] || 0) > y ? "X" : (board.o[25 - x] || 0) > y ? "O" : " ";
        line += " ";
      }
      line += "| ";
      line += (board.x.bar || 0) > y ? "X" : " ";
      line += " |";
      for (; x > 0; x--) {
        line += " ";
        line +=
          (board.x[x] || 0) > y ? "X" : (board.o[25 - x] || 0) > y ? "O" : " ";
        line += " ";
      }
      line += "| ";
      for (x = 0; x < 3; x++) {
        line += cOffX > 5 * x + y ? "X" : " ";
      }
      line += " ";

      stdout(line);
    }
  })();

  (function () {
    let line =
      onRoll === PlayerSide.X
        ? " +12-11-10--9--8--7-------6--5--4--3--2--1-+     "
        : " +13-14-15-16-17-18------19-20-21-22-23-24-+     ";

    stdout(line);
  })();

  stdout(formatPlayerInfo(info.X, "X", info, countPips(board.x)));
}

function formatPlayerInfo(
  p: PlayerInfo,
  sign: string,
  info: GameInfo,
  pips: number
) {
  let txt = `${sign}: ${p.name}`;
  txt += ` [${pips}]`;

  if (p.cube) {
    txt += ` (Cube: ${p.cube})`;
  }
  if (info.matchTo) {
    txt += ` - ${p.points}/${info.matchTo} points`;
  } else {
    txt += ` - ${p.points} points`;
  }

  return ` ${centerText(txt, 43)}`.padEnd(49);
}

function centerText(txt: string, len: number) {
  if (txt.length > len) {
    return txt.substring(0, len);
  }
  let pos = Math.floor(len / 2) - Math.ceil(txt.length / 2);
  return `${"".padEnd(pos)}${txt}`.padEnd(len);
}

function countPips(layout: ICheckerLayout): number {
  let pips = 0;
  for (let i = 1; i < 25; i++) {
    pips += (layout[i] || 0) * i;
  }
  pips += (layout.bar || 0) * 25;
  return pips;
}
