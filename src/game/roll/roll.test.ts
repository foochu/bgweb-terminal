import { GameState, IMatchState, IPlayer, PlayerType } from "../../types";
import { roll } from "./roll";

describe("roll", () => {
  const x: IPlayer = {
    name: "chuck",
    type: PlayerType.Human,
  };
  const o: IPlayer = {
    name: "cpu",
    type: PlayerType.Computer,
  };

  let legalMoves: any[] = [];

  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.49);

    // mock fetch
    jest.spyOn(global, "fetch").mockReturnValue({
      status: 200,
      ok: true,
      json: async () => legalMoves,
    } as any);

    legalMoves = [
      {
        play: [
          { from: "6", to: "3" },
          { from: "6", to: "3" },
          { from: "6", to: "3" },
          { from: "6", to: "3" },
        ],
      },
    ];
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
    jest.spyOn(global, "fetch").mockRestore();
  });

  it("should roll", async () => {
    let stdout = jest.fn(),
      stderr = jest.fn();

    let state: IMatchState = {
      players: { x, o },
      board: {
        x: { 6: 5, 8: 3, 13: 5, 24: 2 },
        o: { 6: 5, 8: 3, 13: 5, 24: 2 },
      },
      inTurn: x,
      onRoll: x,
      gameState: GameState.Playing,
      points: { x: 0, o: 0 },
    };

    state = await roll({ argv: [], state, stdout, stderr });

    expect(stderr.mock.calls.length).toEqual(0);
    expect(stdout.mock.calls.length).toEqual(1);
    expect(stdout.mock.calls[0][0]).toContain("|BAR|");

    expect(state.dice).toEqual([3, 3]);
    expect(state.inTurn).toBe(x);
    expect(state.onRoll).toBe(x);
  });

  it("should swap if cannot move", async () => {
    legalMoves = [];

    let stdout = jest.fn(),
      stderr = jest.fn();

    let state: IMatchState = {
      players: { x, o },
      board: {
        x: { 6: 5, 8: 3, 13: 5, 24: 2 },
        o: { 6: 5, 8: 3, 13: 5, 24: 2 },
      },
      inTurn: x,
      onRoll: x,
      gameState: GameState.Playing,
      points: { x: 0, o: 0 },
    };

    state = await roll({ argv: [], state, stdout, stderr });

    expect(stderr.mock.calls.length).toEqual(0);
    expect(stdout.mock.calls.length).toEqual(3);
    expect(stdout.mock.calls[0][0]).toContain("|BAR|");
    expect(stdout.mock.calls[1]).toEqual(["chuck cannot move."]);
    expect(stdout.mock.calls[2][0]).toContain("|BAR|");

    expect(state.dice).toBe(undefined);
    expect(state.inTurn).toBe(o);
    expect(state.onRoll).toBe(o);
  });
});
