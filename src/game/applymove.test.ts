import { IBoard, IMove, PlayerSide } from "../types";
import { applyMove } from "./applymove";

describe("apply move", () => {
  it("should apply 8/5 6/5", () => {
    let board: IBoard = {
      x: { 6: 5, 8: 3, 13: 5, 24: 2 },
      o: { 6: 5, 8: 3, 13: 5, 24: 2 },
    };
    let move: IMove = {
      play: [
        { from: 8, to: 5 },
        { from: 6, to: 5 },
      ],
    };

    expect(applyMove(board, move, PlayerSide.X)).toEqual({
      x: { 5: 2, 6: 4, 8: 2, 13: 5, 24: 2 },
      o: { 6: 5, 8: 3, 13: 5, 24: 2 },
    });
  });

  it("should apply hit X", () => {
    let board: IBoard = {
      x: { 6: 5, 7: 1, 8: 4, 10: 1, 13: 2, 23: 1, 24: 1 },
      o: { 3: 2, 6: 4, 8: 2, 13: 5, 24: 2 },
    };
    let move: IMove = {
      play: [
        { from: 24, to: 18 },
        { from: 13, to: 9 },
      ],
    };

    expect(applyMove(board, move, PlayerSide.O)).toEqual({
      x: { 6: 5, 7: 0, 8: 4, 10: 1, 13: 2, 23: 1, 24: 1, bar: 1 },
      o: { 3: 2, 6: 4, 8: 2, 9: 1, 13: 4, 18: 1, 24: 1 },
    });
  });
});
