import { GameState, IMatchState, IPlayer, PlayerType } from "../types";
import { commands } from "./command";

describe("commands", () => {
  const x: IPlayer = {
    name: "chuck",
    type: PlayerType.Human,
  };
  const o: IPlayer = {
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

  it("should run nested command", async () => {
    let stdout = jest.fn(),
      stderr = jest.fn();

    let state: IMatchState = {
      players: { x, o },
      board: {
        x: {},
        o: {},
      },
      inTurn: x,
      onRoll: x,
      gameState: GameState.None,
      points: { x: 0, o: 0 },
    };

    let cmd = commands.filter(({ name }) => name === "new")[0].fn;

    await cmd({
      argv: ["game"],
      state,
      stdout,
      stderr,
    });

    expect(stderr.mock.calls.length).toEqual(0);
    expect(stdout.mock.calls.length).toEqual(2);
    expect(stdout.mock.calls[0]).toEqual(["chuck rolls 5, cpu rolls 3."]);
  });
});
