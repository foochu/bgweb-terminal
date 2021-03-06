import { IBoard } from "../types";
import { formatMove } from "./formatMove";

describe("format move", () => {
  const board: IBoard = {
    x: { 6: 5, 8: 3, 13: 5, 24: 2 },
    o: { 6: 5, 8: 3, 13: 5, 24: 2 },
  };
  it("should format 8/5 6/5", () => {
    expect(
      formatMove(
        {
          play: [
            { from: 8, to: 5 },
            { from: 6, to: 5 },
          ],
        },
        board.o
      )
    ).toEqual("8/5 6/5");
  });

  it("should format 8/7(2) 6/5(2)", () => {
    expect(
      formatMove(
        {
          play: [
            { from: 6, to: 5 },
            { from: 6, to: 5 },
            { from: 8, to: 7 },
            { from: 8, to: 7 },
          ],
        },
        board.o
      )
    ).toEqual("8/7(2) 6/5(2)");
  });

  it("should format 24/13", () => {
    expect(
      formatMove(
        {
          play: [
            { from: 24, to: 18 },
            { from: 18, to: 13 },
          ],
        },
        board.o
      )
    ).toEqual("24/13");
  });

  it("should format 24/18 18/13", () => {
    const board: IBoard = {
      x: { 6: 5, 8: 3, 13: 5, 24: 2 },
      o: { 6: 5, 7: 1, 8: 2, 13: 5, 22: 1, 24: 1 },
    };
    expect(
      formatMove(
        {
          play: [
            { from: 24, to: 18 },
            { from: 18, to: 13 },
          ],
        },
        board.o
      )
    ).toEqual("24/18 18/13");
  });

  it("should format 13/9(2)", () => {
    expect(
      formatMove(
        {
          play: [
            { from: 13, to: 11 },
            { from: 11, to: 9 },
            { from: 13, to: 11 },
            { from: 11, to: 9 },
          ],
        },
        board.o
      )
    ).toEqual("13/9(2)");
  });

  it.only("should format bar/21 8/4(3)", () => {
    expect(
      formatMove(
        {
          play: [
            { from: "bar", to: 21 },
            { from: 8, to: 4 },
            { from: 8, to: 4 },
            { from: 8, to: 4 },
          ],
        },
        board.o
      )
    ).toEqual("bar/21 8/4(3)");
  });
});
