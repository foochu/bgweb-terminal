import { GameState, IMatchState, IPlayer, PlayerType } from "../../types";
import { play } from "./play";

describe("play", () => {
  let x: IPlayer = {
    name: "chuck",
    type: PlayerType.Human,
  };
  let o: IPlayer = {
    name: "cpu",
    type: PlayerType.Computer,
  };

  beforeEach(() => {
    // mock fetch
    const move = {
      play: [
        { from: "8", to: "5" },
        { from: "6", to: "5" },
      ],
    };
    window.wasm_get_moves = jest.fn(() => JSON.stringify([move]));
  });

  afterEach(() => {
    window.wasm_get_moves = undefined;
  });

  it("should play", async () => {
    let stdout = jest.fn(),
      stderr = jest.fn();

    let state: IMatchState = {
      players: { x, o },
      board: {
        x: { 6: 5, 8: 3, 13: 5, 24: 2 },
        o: { 6: 5, 8: 3, 13: 5, 24: 2 },
      },
      inTurn: o,
      onRoll: o,
      gameState: GameState.Playing,
      points: { x: 0, o: 0 },
    };

    state = await play({ argv: [], state, stdout, stderr });

    expect(stderr.mock.calls.length).toEqual(0);
    expect(stdout.mock.calls.length).toEqual(3);
    expect(stdout.mock.calls[0][0]).toContain("|BAR|");
    expect(stdout.mock.calls[1]).toEqual(["cpu moves 8/5 6/5."]);
    expect(stdout.mock.calls[2][0]).toContain("|BAR|");

    expect(state.board).toEqual({
      x: { 6: 5, 8: 3, 13: 5, 24: 2 },
      o: { 5: 2, 6: 4, 8: 2, 13: 5, 24: 2 },
    });
    expect(state.dice).toBe(undefined);
    expect(state.inTurn).toBe(x);
    expect(state.onRoll).toBe(x);
  });
});
