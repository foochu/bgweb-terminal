import { IBoard, PlayerSide } from "../types";
import { drawBoard } from "./drawBoard";

describe("draw board", () => {
  let info = {
    X: {
      name: "chuck",
      points: 0,
    },
    O: {
      name: "cpu",
      points: 0,
    },
  };
  it("should draw starting board - X's turn", () => {
    const stdout = jest.fn();
    const board: IBoard = {
      x: { 6: 5, 8: 3, 13: 5, 24: 2 },
      o: { 6: 5, 8: 3, 13: 5, 24: 2 },
    };

    drawBoard(stdout, board, PlayerSide.X, info);

    expect(stdout.mock.calls.map((a) => a[0])).toEqual([
      " BGWeb Terminal  Position ID: 4HPwATDgc/ABMA",
      "          O: cpu [167] - 0 points                ",
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
      "         X: chuck [167] - 0 points               ",
    ]);
  });

  it("should draw starting board - O's turn", () => {
    const stdout = jest.fn();
    const board: IBoard = {
      x: { 6: 5, 8: 3, 13: 5, 24: 2 },
      o: { 6: 5, 8: 3, 13: 5, 24: 2 },
    };

    drawBoard(stdout, board, PlayerSide.O, info);

    expect(stdout.mock.calls.map((a) => a[0])).toEqual([
      " BGWeb Terminal  Position ID: 4HPwATDgc/ABMA",
      "          O: cpu [167] - 0 points                ",
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
      "         X: chuck [167] - 0 points               ",
    ]);
  });

  it("should draw starting board - on bar", () => {
    const stdout = jest.fn();
    const board: IBoard = {
      x: { 6: 5, 8: 3, 13: 5, 24: 1, bar: 1 },
      o: { 6: 5, 8: 3, 13: 5, 24: 1, bar: 1 },
    };

    drawBoard(stdout, board, PlayerSide.O, info);

    expect(stdout.mock.calls.map((a) => a[0])).toEqual([
      " BGWeb Terminal  Position ID: 4HPwAVDgc/ABUA",
      "          O: cpu [168] - 0 points                ",
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
      "         X: chuck [168] - 0 points               ",
    ]);
  });

  it("should draw example board", () => {
    const stdout = jest.fn();
    const board: IBoard = {
      x: { 1: 2, 2: 2, 3: 2, 4: 2, 5: 1, off: 6 },
      o: { 1: 1, 3: 1, 4: 3, 5: 1, 6: 2, off: 7 },
    };

    const info = {
      X: {
        name: "chuck",
        points: 0,
        roll: "X Rolled 11",
        cube: 2,
      },
      O: {
        name: "cpu",
        points: 0,
        // roll: "O offered cube at 2",
        cube: 2,
      },
      cube: 1,
      matchTo: 7,
    };

    drawBoard(stdout, board, PlayerSide.X, info);

    expect(stdout.mock.calls.map((a) => a[0])).toEqual([
      " BGWeb Terminal  Position ID: 6RoAALYtAAAAAA",
      "     O: cpu [33] (Cube: 2) - 0/7 points          ",
      " +13-14-15-16-17-18------19-20-21-22-23-24-+     ",
      " |                  |   | O  O  O  O     O | OO  ",
      " |                  |   | O     O          | OO  ",
      " |                  |   |       O          | O   ",
      " |                  |   |                  | O   ",
      " |                  |   |                  | O   ",
      "v|                  |BAR|   X Rolled 11    |     ",
      " |                  |   |                  | X   ",
      " |                  |   |                  | X   ",
      " |                  |   |                  | X   ",
      " |                  |   |       X  X  X  X | X   ",
      " |                  |   |    X  X  X  X  X | XX  ",
      " +12-11-10--9--8--7-------6--5--4--3--2--1-+     ",
      "    X: chuck [25] (Cube: 2) - 0/7 points         ",
    ]);
  });
});
