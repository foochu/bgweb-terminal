import { parseMove } from "./parsemove";

describe("parse move", () => {
  it("should parse 8/5 6/5", () => {
    expect(parseMove(["8/5", "6/5"])).toEqual({
      play: [
        { from: 8, to: 5 },
        { from: 6, to: 5 },
      ],
    });
  });

  it("should parse 8/5(2)", () => {
    expect(parseMove(["8/5(2)"])).toEqual({
      play: [
        { from: 8, to: 5 },
        { from: 8, to: 5 },
      ],
    });
  });

  it("should parse 13/8 24/23", () => {
    expect(parseMove(["13/8", "24/23"])).toEqual({
      play: [
        { from: 13, to: 8 },
        { from: 24, to: 23 },
      ],
    });
  });

  it("should parse b/24", () => {
    expect(parseMove(["b/24"])).toEqual({
      play: [{ from: "bar", to: 24 }],
    });
  });
});
