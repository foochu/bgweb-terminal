import {
  GameState,
  IMatchState,
  IPlayer,
  PlayerSide,
  PlayerType,
} from "../../types";
import { decline } from "./decline";

describe("decline", () => {
  let x: IPlayer = {
    name: "chuck",
    type: PlayerType.Human,
  };
  let o: IPlayer = {
    name: "cpu",
    type: PlayerType.Computer,
  };

  it("should decline", async () => {
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
      resigned: 1,
      points: { x: 0, o: 0 },
    };

    state = await decline({ argv: [], state, stdout, stderr });

    expect(stderr.mock.calls.length).toEqual(0);
    expect(stdout.mock.calls.length).toEqual(2);
    expect(stdout.mock.calls[0]).toEqual(["chuck declines the single game."]);
    expect(stdout.mock.calls[1][0]).toContain(
      " BGWeb Terminal  Position ID: 4HPwATDgc/ABMA"
    );

    expect(state.resigned).toEqual(undefined);
    expect(state.resignationDeclined).toEqual(1);
    expect(state.inTurn).toBe(o);
    expect(state.onRoll).toBe(o);
  });
});
