import {
  Dice,
  GameState,
  IBoard,
  IMatchState,
  IPlayer,
  PlayerType,
  STDIO,
} from "../../types";
import { CmdArgs, rollDice, showBoard } from "..";
import { computerTurn } from "../computerturn";

export async function newGame(args: CmdArgs): Promise<IMatchState> {
  const { state, stdout, stderr } = args;

  // TODO: check match score

  if (state.gameState === GameState.Playing) {
    // TODO: proper cmd line confirm()
    if (
      !global.confirm(
        "Are you sure you want to start a new game, and discard the rest of the match?"
      )
    ) {
      return state;
    }
  }

  return showBoard(await startNewGame(state, stdout, stderr), stdout);
}

async function startNewGame(
  state: Readonly<IMatchState>,
  stdout: STDIO,
  stderr: STDIO
): Promise<IMatchState> {
  // TODO: match score

  // TODO auto doubles
  // TODO: state.crawford & postCrawford
  // TODO state.bgv
  // TODO: state.cubeInUse
  // TODO: state.jacoby

  let board = initBoard();

  let dice: Dice;
  while (true) {
    // roll dice until no doubles
    dice = rollDice();

    stdout(
      `${state.players.x.name} rolls ${dice[0]}, ${state.players.o.name} rolls ${dice[1]}.`
    );

    if (dice[0] === dice[1]) {
      // TODO: auto doubles
      continue;
    }

    break;
  }

  let inTurn: IPlayer;
  if (dice[0] > dice[1]) {
    inTurn = state.players.x;
  } else {
    inTurn = state.players.o;
  }
  let onRoll = state.inTurn;

  // sort dice
  dice = [Math.max(dice[0], dice[1]), Math.min(dice[0], dice[1])];

  let newState = {
    ...state,
    gameState: GameState.Playing,
    board,
    dice,
    inTurn,
    onRoll,
    doubled: false,
    cube: 1,
  };

  if (inTurn.type === PlayerType.Human) {
    return newState;
  }
  return await computerTurn(newState, stdout, stderr);
}

function initBoard(): IBoard {
  return {
    x: { 6: 5, 8: 3, 13: 5, 24: 2 },
    o: { 6: 5, 8: 3, 13: 5, 24: 2 },
  };
}
