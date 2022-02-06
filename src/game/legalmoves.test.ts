import { IBoard, PlayerSide } from "../types";
import { isLegalMove } from "./legalmoves";

describe("legal moves", () => {
  const board: IBoard = {
    x: { 6: 5, 8: 3, 13: 5, 24: 2 },
    o: { 6: 5, 8: 3, 13: 5, 24: 2 },
  };

  let legalMoves = [
    {
      play: [
        { from: "8", to: "5" },
        { from: "5", to: "4" },
      ],
    },
    {
      play: [
        { from: "8", to: "5" },
        { from: "6", to: "5" },
      ],
    },
  ];

  beforeEach(() => {
    window.wasm_get_moves = jest.fn(() => JSON.stringify(legalMoves));
  });

  afterEach(() => {
    window.wasm_get_moves = undefined;
  });

  it("should find legal moves", async () => {
    expect(
      await isLegalMove(board, PlayerSide.X, [3, 1], {
        play: [
          { from: 8, to: 5 },
          { from: 5, to: 4 },
        ],
      })
    ).toBe(true);

    expect(
      await isLegalMove(board, PlayerSide.X, [3, 1], {
        play: [
          { from: 8, to: 5 },
          { from: 6, to: 5 },
        ],
      })
    ).toBe(true);
  });

  it("should find illegal moves", async () => {
    expect(
      await isLegalMove(board, PlayerSide.X, [3, 1], {
        play: [
          { from: 8, to: 5 },
          { from: 5, to: 1 },
        ],
      })
    ).toBe(false);
  });
});
