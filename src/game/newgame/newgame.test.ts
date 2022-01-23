import { GameState, IMatchState, IPlayer, PlayerType } from "../../types";
import { newGame } from "./newgame";

describe("newgame", () => {
  let x: IPlayer = {
    name: "chuck",
    type: PlayerType.Human,
  };
  let o: IPlayer = {
    name: "cpu",
    type: PlayerType.Computer,
  };

  beforeEach(() => {
    let i = 1;
    jest.spyOn(global.Math, "random").mockImplementation(() => (i -= 0.33));
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });

  it("should start new game", async () => {
    let stdout = jest.fn(),
      stderr = jest.fn();

    let state: IMatchState = {
      players: { x, o },
      board: { x: {}, o: {} },
      inTurn: x,
      onRoll: x,
      gameState: GameState.None,
      points: { x: 0, o: 0 },
    };

    state = await newGame({ argv: [], state, stdout, stderr });

    expect(stderr.mock.calls.length).toEqual(0);
    expect(stdout.mock.calls.length).toEqual(1);
    expect(stdout.mock.calls[0]).toEqual(["chuck rolls 5, cpu rolls 3."]);

    expect(state.gameState).toBe(GameState.Playing);
    expect(state.board).toEqual({
      x: { 6: 5, 8: 3, 13: 5, 24: 2 },
      o: { 6: 5, 8: 3, 13: 5, 24: 2 },
    });
    expect(state.dice).toEqual([5, 3]);
    expect(state.cube).toEqual(1);
    expect(state.cubeOwner).toBe(undefined);
    expect(state.inTurn).toBe(x);
    expect(state.onRoll).toBe(x);
    expect(state.doubled).toBe(false);
  });
});
