import { GameState, IMatchState, IPlayer, PlayerType } from "../../types";
import { take } from "./take";

describe("take", () => {
  let x: IPlayer = {
    name: "chuck",
    type: PlayerType.Human,
  };
  let o: IPlayer = {
    name: "cpu",
    type: PlayerType.Computer,
  };

  it("should take", async () => {
    let stdout = jest.fn(),
      stderr = jest.fn();

    let state: IMatchState = {
      players: { x, o },
      board: {
        x: { 6: 5, 8: 3, 13: 5, 24: 2 },
        o: { 6: 5, 8: 3, 13: 5, 24: 2 },
      },
      inTurn: x,
      onRoll: o,
      gameState: GameState.Playing,
      points: { x: 0, o: 0 },
    };

    state = await take({ argv: [], state, stdout, stderr });

    expect(stderr.mock.calls.length).toEqual(0);
    expect(stdout.mock.calls.length).toEqual(1);
    expect(stdout.mock.calls[0]).toEqual(["chuck accepts the cube at 2."]);

    expect(state.cube).toEqual(2);
    expect(state.cubeOwner).toBe(x);
    expect(state.inTurn).toBe(o);
    expect(state.onRoll).toBe(o);
  });
});
