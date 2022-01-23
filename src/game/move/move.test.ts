import { GameState, IMatchState, IPlayer, PlayerType } from "../../types";
import { move } from "./move";

describe("move", () => {
  let x: IPlayer = {
    name: "chuck",
    type: PlayerType.Human,
  };
  let o: IPlayer = {
    name: "cpu",
    type: PlayerType.Computer,
  };

  const legalMoves = [
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
    // mock fetch
    jest.spyOn(global, "fetch").mockReturnValue({
      status: 200,
      ok: true,
      json: async () => legalMoves,
    } as any);
  });

  afterEach(() => {
    jest.spyOn(global, "fetch").mockRestore();
  });

  it("should move", async () => {
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
      dice: [3, 1],
      points: { x: 0, o: 0 },
    };

    state = await move({ argv: ["8/5", "6/5"], state, stdout, stderr });

    expect(stderr.mock.calls.length).toEqual(0);
    expect(stdout.mock.calls.length).toEqual(0);
    //    expect(stdout.mock.calls[0]).toEqual(["todo"]);

    expect(state.board).toEqual({
      x: { 5: 2, 6: 4, 8: 2, 13: 5, 24: 2 },
      o: { 6: 5, 8: 3, 13: 5, 24: 2 },
    });
    expect(state.dice).toBe(undefined);
    expect(state.inTurn).toBe(o);
    expect(state.onRoll).toBe(o);
  });
});
