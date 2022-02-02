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

  const _legalMoves = [
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
  let legalMoves: any;

  beforeEach(() => {
    // mock fetch
    jest.spyOn(global, "fetch").mockReturnValue({
      status: 200,
      ok: true,
      json: async () => legalMoves,
    } as any);
    legalMoves = _legalMoves;
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
    expect(stdout.mock.calls.length).toEqual(1);
    expect(stdout.mock.calls[0][0]).toContain(
      " BGWeb Terminal  Position ID: sGfwATDgc/ABMA"
    );

    expect(state.board).toEqual({
      x: { 5: 2, 6: 4, 8: 2, 13: 5, 24: 2 },
      o: { 6: 5, 8: 3, 13: 5, 24: 2 },
    });
    expect(state.dice).toBe(undefined);
    expect(state.inTurn).toBe(o);
    expect(state.onRoll).toBe(o);
  });

  it("should detect game over", async () => {
    let stdout = jest.fn(),
      stderr = jest.fn();

    let state: IMatchState = {
      players: { x, o },
      board: {
        x: { 1: 1, off: 14 },
        o: { 1: 1, off: 14 },
      },
      inTurn: x,
      onRoll: x,
      gameState: GameState.Playing,
      dice: [3, 1],
      points: { x: 0, o: 0 },
    };

    legalMoves = [
      {
        play: [{ from: "1", to: "off" }],
      },
    ];

    state = await move({ argv: ["1/off"], state, stdout, stderr });

    expect(stderr.mock.calls.length).toEqual(0);
    expect(stdout.mock.calls.length).toEqual(2);
    expect(stdout.mock.calls[0][0]).toContain(
      " BGWeb Terminal  Position ID: AQAAAAAAAAAAAA"
    );
    expect(stdout.mock.calls[1]).toEqual(["Game complete. chuck wins 1 point"]);

    expect(state.board).toEqual({
      x: { off: 15 },
      o: { 1: 1, off: 14 },
    });
    expect(state.dice).toBe(undefined);
    expect(state.inTurn).toBe(x);
    expect(state.onRoll).toBe(x);
    expect(state.gameState).toBe(GameState.Over);
    expect(state.points).toEqual({ x: 1, o: 0 });
  });
});
