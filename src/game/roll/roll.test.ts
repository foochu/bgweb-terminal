import {
  GameState,
  IMatchState,
  IPlayer,
  PlayerSide,
  PlayerType,
} from "../../types";
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

  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.49);
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
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
    expect(stdout.mock.calls.length).toEqual(0);

    expect(state.dice).toEqual([3, 3]);
    expect(state.inTurn).toBe(x);
    expect(state.onRoll).toBe(x);
  });
});
