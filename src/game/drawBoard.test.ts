import { IBoard, PlayerSide } from "../types";
import { drawBoard } from "./drawBoard";

describe("draw board", () => {
  it("should draw starting board - X's turn", () => {
    const stdout = jest.fn();
    const board: IBoard = {
      x: { 6: 5, 8: 3, 13: 5, 24: 2 },
      o: { 6: 5, 8: 3, 13: 5, 24: 2 },
    };

    drawBoard(stdout, board, PlayerSide.X, [], "0123456789ABCD");

    expect(stdout.mock.calls.map((a) => a[0])).toEqual([
      " BGWeb Terminal  Position ID: 4HPwATDgc/ABMA",
      "                 Match ID   : 0123456789ABCD",
      " +13-14-15-16-17-18------19-20-21-22-23-24-+     ",
      " | X           O    |   | O              X |     ",
      " | X           O    |   | O              X |     ",
      " | X           O    |   | O                |     ",
      " | X                |   | O                |     ",
      " | X                |   | O                |     ",
      "v|                  |BAR|                  |     ",
      " | O                |   | X                |     ",
      " | O                |   | X                |     ",
      " | O           X    |   | X                |     ",
      " | O           X    |   | X              O |     ",
      " | O           X    |   | X              O |     ",
      " +12-11-10--9--8--7-------6--5--4--3--2--1-+     ",
    ]);
  });

  it("should draw starting board - O's turn", () => {
    const stdout = jest.fn();
    const board: IBoard = {
      x: { 6: 5, 8: 3, 13: 5, 24: 2 },
      o: { 6: 5, 8: 3, 13: 5, 24: 2 },
    };

    drawBoard(stdout, board, PlayerSide.O, [], "0123456789ABCD");

    expect(stdout.mock.calls.map((a) => a[0])).toEqual([
      " BGWeb Terminal  Position ID: 4HPwATDgc/ABMA",
      "                 Match ID   : 0123456789ABCD",
      " +12-11-10--9--8--7-------6--5--4--3--2--1-+     ",
      " | X           O    |   | O              X |     ",
      " | X           O    |   | O              X |     ",
      " | X           O    |   | O                |     ",
      " | X                |   | O                |     ",
      " | X                |   | O                |     ",
      "^|                  |BAR|                  |     ",
      " | O                |   | X                |     ",
      " | O                |   | X                |     ",
      " | O           X    |   | X                |     ",
      " | O           X    |   | X              O |     ",
      " | O           X    |   | X              O |     ",
      " +13-14-15-16-17-18------19-20-21-22-23-24-+     ",
    ]);
  });

  it("should draw starting board - on bar", () => {
    const stdout = jest.fn();
    const board: IBoard = {
      x: { 6: 5, 8: 3, 13: 5, 24: 1, bar: 1 },
      o: { 6: 5, 8: 3, 13: 5, 24: 1, bar: 1 },
    };

    drawBoard(stdout, board, PlayerSide.O, [], "0123456789ABCD");

    expect(stdout.mock.calls.map((a) => a[0])).toEqual([
      " BGWeb Terminal  Position ID: 4HPwAVDgc/ABUA",
      "                 Match ID   : 0123456789ABCD",
      " +12-11-10--9--8--7-------6--5--4--3--2--1-+     ",
      " | X           O    | O | O              X |     ",
      " | X           O    |   | O                |     ",
      " | X           O    |   | O                |     ",
      " | X                |   | O                |     ",
      " | X                |   | O                |     ",
      "^|                  |BAR|                  |     ",
      " | O                |   | X                |     ",
      " | O                |   | X                |     ",
      " | O           X    |   | X                |     ",
      " | O           X    |   | X                |     ",
      " | O           X    | X | X              O |     ",
      " +13-14-15-16-17-18------19-20-21-22-23-24-+     ",
    ]);
  });

  it("should draw example board", () => {
    const stdout = jest.fn();
    const board: IBoard = {
      x: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 1, off: 6 },
      o: { 1: 1, 3: 1, 4: 3, 5: 1, 6: 2, off: 7 },
    };
    const sidebar = [
      "O: cpu (Cube: 2)",
      "0 points",
      "Cube offered at 2",
      "Cube: 1 (7 point match)",
      "Rolled 11",
      "0 points",
      "X: chuck (Cube: 2)",
    ];

    drawBoard(stdout, board, PlayerSide.X, sidebar, "0123456789ABCD");

    expect(stdout.mock.calls.map((a) => a[0])).toEqual([
      " BGWeb Terminal  Position ID: 6RoAALYtAAAAAA",
      "                 Match ID   : 0123456789ABCD",
      " +13-14-15-16-17-18------19-20-21-22-23-24-+     O: cpu (Cube: 2)",
      " |                  |   | O  O  O  O     O | OO  0 points",
      " |                  |   | O     O          | OO  Cube offered at 2",
      " |                  |   |       O          | O   ",
      " |                  |   |                  | O   ",
      " |                  |   |                  | O   ",
      "v|                  |BAR|                  |     Cube: 1 (7 point match)",
      " |                  |   |                  | X   ",
      " |                  |   |                  | X   ",
      " |                  |   |                  | X   ",
      " |                  |   |       X  X  X  X | X   Rolled 11",
      " |                  |   |    X  X  X  X  X | XX  0 points",
      " +12-11-10--9--8--7-------6--5--4--3--2--1-+     X: chuck (Cube: 2)",
    ]);
  });
});
