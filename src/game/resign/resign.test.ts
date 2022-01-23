import {
  GameState,
  IMatchState,
  IPlayer,
  PlayerSide,
  PlayerType,
} from "../../types";
import { resign } from "./resign";

describe("resign", () => {
  let x: IPlayer = {
    name: "chuck",
    type: PlayerType.Human,
  };
  let o: IPlayer = {
    name: "cpu",
    type: PlayerType.Computer,
  };

  it("should resign single", async () => {
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

    state = await resign({ argv: [], state, stdout, stderr });

    expect(stderr.mock.calls.length).toEqual(0);
    expect(stdout.mock.calls.length).toEqual(1);
    expect(stdout.mock.calls[0]).toEqual([
      "chuck offers to resign a single game.",
    ]);

    expect(state.inTurn).toBe(o);
    expect(state.onRoll).toBe(o);
  });

  it("should resign gammon", async () => {
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

    state = await resign({ argv: ["gammon"], state, stdout, stderr });

    expect(stderr.mock.calls.length).toEqual(0);
    expect(stdout.mock.calls.length).toEqual(1);
    expect(stdout.mock.calls[0]).toEqual(["chuck offers to resign a gammon."]);

    expect(state.inTurn).toBe(o);
    expect(state.onRoll).toBe(o);
  });
});
