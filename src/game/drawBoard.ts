import { IBoard, PlayerSide, STDIO } from "../types";
import { positionIdFromBoard } from "./positionid";

const achX = "     X6789ABCDEF";
const achO = "     O6789ABCDEF";

/*
 *  BGWeb Terminal  Position ID: 0123456789ABCD
 *                  Match ID   : 0123456789ABCD
 *  +13-14-15-16-17-18------19-20-21-22-23-24-+     O: cpu (Cube: 2)
 *  |                  |   | O  O  O  O     O | OO  0 points
 *  |                  |   | O     O          | OO  Cube offered at 2
 *  |                  |   |       O          | O
 *  |                  |   |                  | O
 *  |                  |   |                  | O
 * v|                  |BAR|                  |     Cube: 1 (7 point match)
 *  |                  |   |                  | X
 *  |                  |   |                  | X
 *  |                  |   |                  | X
 *  |                  |   |       X  X  X  X | X   Rolled 11
 *  |                  |   |    X  X  X  X  X | XX  0 points
 *  +12-11-10--9--8--7-------6--5--4--3--2--1-+     X: chuck (Cube: 2)
 *
 */

export function drawBoard(
  stdout: STDIO,
  board: IBoard,
  onRoll: PlayerSide,
  sidebar: string[],
  matchId: string
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

  (function () {
    if (matchId) {
      // pch += sprintf(pch, "                 %s   : %s\n", _("Match ID"), szMatchID);
      let line = `                 Match ID   : ${matchId}`;
      stdout(line);
    }
  })();

  (function () {
    let line =
      onRoll === PlayerSide.X
        ? " +13-14-15-16-17-18------19-20-21-22-23-24-+     "
        : " +12-11-10--9--8--7-------6--5--4--3--2--1-+     ";

    if (sidebar[0]) {
      line += sidebar[0];
    }

    stdout(line);
  })();

  (function () {
    for (let y = 0; y < 4; y++) {
      let x = 0;
      let line = " |";

      for (x = 13; x < 19; x++) {
        line += " ";
        line += board.x[x] > y ? "X" : board.o[25 - x] > y ? "O" : " ";
        line += " ";
      }
      line += "| ";
      line += (board.o.bar || 0) > y ? "O" : " ";
      line += " |";
      for (; x < 25; x++) {
        line += " ";
        line += board.x[x] > y ? "X" : board.o[25 - x] > y ? "O" : " ";
        line += " ";
      }
      line += "| ";
      for (x = 0; x < 3; x++) {
        line += cOffO > 5 * x + y ? "O" : " ";
      }
      line += " ";
      if (y < 2 && sidebar[y + 1]) {
        line += sidebar[y + 1];
      }
      stdout(line);
    }
  })();

  (function () {
    let line = " |";
    let x = 0;

    for (x = 13; x < 19; x++) {
      line += " ";
      line += board.x[x] ? achX[board.x[x]] : achO[board.o[25 - x] || 0];
      line += " ";
    }

    line += "| ";
    line += achO[board.o.bar || 0];
    line += " |";

    for (; x < 25; x++) {
      line += " ";
      line += board.x[x] ? achX[board.x[x]] : achO[board.o[25 - x] || 0];
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
    line += "|                  |BAR|                  |     ";

    if (sidebar[3]) {
      line += sidebar[3];
    }

    stdout(line);
  })();

  (function () {
    let line = " |";
    let x = 0;

    for (x = 12; x > 6; x--) {
      line += " ";
      line += board.x[x] ? achX[board.x[x]] : achO[board.o[25 - x] || 0];
      line += " ";
    }

    line += "| ";
    line += achX[board.x.bar || 0];
    line += " |";

    for (; x > 0; x--) {
      line += " ";
      line += board.x[x] ? achX[board.x[x]] : achO[board.o[25 - x] || 0];
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
        line += board.x[x] > y ? "X" : board.o[25 - x] > y ? "O" : " ";
        line += " ";
      }
      line += "| ";
      line += (board.x.bar || 0) > y ? "X" : " ";
      line += " |";
      for (; x > 0; x--) {
        line += " ";
        line += board.x[x] > y ? "X" : board.o[25 - x] > y ? "O" : " ";
        line += " ";
      }
      line += "| ";
      for (x = 0; x < 3; x++) {
        line += cOffX > 5 * x + y ? "X" : " ";
      }
      line += " ";
      if (y < 2 && sidebar[5 - y]) {
        line += sidebar[5 - y];
      }
      stdout(line);
    }
  })();

  (function () {
    let line =
      onRoll === PlayerSide.X
        ? " +12-11-10--9--8--7-------6--5--4--3--2--1-+     "
        : " +13-14-15-16-17-18------19-20-21-22-23-24-+     ";

    if (sidebar[6]) {
      line += sidebar[6];
    }

    stdout(line);
  })();
}
