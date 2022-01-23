import { IBoard } from "../types";
import { positionIdFromBoard } from "./positionid";

describe("position id", () => {
  it("should get initial board", () => {
    const board: IBoard = {
      x: { 6: 5, 8: 3, 13: 5, 24: 2 },
      o: { 6: 5, 8: 3, 13: 5, 24: 2 },
    };
    expect(positionIdFromBoard(board)).toEqual("4HPwATDgc/ABMA");
  });
});
