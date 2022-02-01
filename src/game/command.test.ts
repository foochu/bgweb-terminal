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

  it("should help", () => {
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

    let help = commands.filter(({ name }) => name === "help")[0].fn;

    help({
      argv: [],
      state,
      stdout,
      stderr,
    });

    expect(stderr.mock.calls.length).toEqual(0);
    expect(stdout.mock.calls.length).toEqual(1);
    expect(stdout.mock.calls).toEqual([
      [
        ` -------------------------------------------
 | Command    | Description                |
 -------------------------------------------
 | new game   | Start a new game           |
 | move       | Make a backgammon move     |
 | play       | Force the computer to move |
 | roll       | Roll the dice              |
 | hint       | Give hint on best moves    |
 | xhint      | Give detailed hint         |
 | help       | Describe commands          |
 | clear      | Clear the screen           |
 -------------------------------------------`,
      ],
    ]);
  });
});
