import { GameState, IMatchState, IPlayer, PlayerType } from "../../types";
import { hint } from "./hint";

describe("hint", () => {
  let x: IPlayer = {
    name: "chuck",
    type: PlayerType.Human,
  };
  let o: IPlayer = {
    name: "cpu",
    type: PlayerType.Computer,
  };

  const bestMoves = [
    {
      play: [
        { from: "8", to: "5" },
        { from: "5", to: "4" },
      ],
      evaluation: {
        info: { cubeful: false, plies: 3 },
        eq: 0.218,
        diff: 0,
        probability: {
          win: 0.551,
          winG: 0.174,
          winBG: 0.013,
          lose: 0.449,
          loseG: 0.124,
          loseBG: 0.005,
        },
      },
    },
    {
      play: [
        { from: "8", to: "5" },
        { from: "6", to: "5" },
      ],
      evaluation: {
        info: { cubeful: false, plies: 3 },
        eq: -0.012,
        diff: -0.23,
        probability: {
          win: 0.497,
          winG: 0.137,
          winBG: 0.008,
          lose: 0.503,
          loseG: 0.14,
          loseBG: 0.007,
        },
      },
    },
  ];

  beforeEach(() => {
    // mock fetch
    jest.spyOn(global, "fetch").mockReturnValue({
      status: 200,
      ok: true,
      json: async () => bestMoves,
    } as any);
  });

  afterEach(() => {
    jest.spyOn(global, "fetch").mockRestore();
  });

  it("should give hint", async () => {
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
      dice: [3, 1],
      gameState: GameState.Playing,
      points: { x: 0, o: 0 },
    };

    state = await hint({ argv: [], state, stdout, stderr });

    expect(stderr.mock.calls.length).toEqual(4);
    expect(stderr.mock.calls).toEqual([
      [" 1. Cubeless 3-ply   8/4                          Eq. 0.218 "],
      ["       win: 55% (G:17% BG:1%) - lose: 45% (G:12% BG:1%)"],
      [" 2. Cubeless 3-ply   8/5 6/5                      Eq. -0.012 (-0.23)"],
      ["       win: 50% (G:14% BG:1%) - lose: 50% (G:14% BG:1%)"],
    ]);
    expect(stdout.mock.calls.length).toEqual(0);

    expect(state.inTurn).toBe(x);
    expect(state.onRoll).toBe(x);
  });
});
