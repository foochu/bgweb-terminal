import { applyMove } from "./applymove";
import { drawBoard } from "./drawBoard";
import {
  Dice,
  GameState,
  IBoard,
  ICheckerLayout,
  IMatchState,
  IMove,
  IPlayer,
  PlayerSide,
  STDIO,
} from "../types";

export type CmdProto = (args: CmdArgs) => Promise<IMatchState>;

export type CmdArgs = {
  argv: string[];
  state: Readonly<IMatchState>;
  stdout: STDIO;
  stderr: STDIO;
};

export function getCurrentSide(state: Readonly<IMatchState>): PlayerSide {
  if (state.inTurn === state.players.x) {
    return PlayerSide.X;
  }
  return PlayerSide.O;
}

export function getPlayerNotInTurn(state: Readonly<IMatchState>): IPlayer {
  if (state.inTurn === state.players.x) {
    return state.players.o;
  }
  return state.players.x;
}

export function showBoard(
  state: Readonly<IMatchState>,
  stdout: STDIO
): IMatchState {
  // TODO: if (state.doubled) { }

  function getRollInfo(sign: string) {
    if (state.dice) {
      return `${sign} Rolled ${state.dice[0]}${state.dice[1]}`;
    } else if (state.gameState === GameState.Playing) {
      return `${sign} On roll`;
    }
    return "";
  }

  let info = {
    X: {
      name: state.players.x.name,
      points: state.points.x,
      roll: state.inTurn === state.players.x ? getRollInfo("X") : "",
    },
    O: {
      name: state.players.o.name,
      points: state.points.o,
      roll: state.inTurn === state.players.o ? getRollInfo("O") : "",
    },
    // cube: state.cube TODO: cube & match info
  };

  let output: string[] = [];

  drawBoard((s) => output.push(s), state.board, getCurrentSide(state), info);

  stdout(output.join("\n"));

  return state;
}

export function swapTurn(state: Readonly<IMatchState>): IMatchState {
  let inTurn: IPlayer;
  if (state.inTurn === state.players.x) {
    inTurn = state.players.o;
  } else {
    inTurn = state.players.x;
  }
  let onRoll = inTurn;
  return { ...state, inTurn, onRoll };
}

export function gameResult(points: number) {
  const gameResult: string[] = ["single game", "gammon", "backgammon"];
  return gameResult[points - 1];
}

export function rollDice(): Dice {
  return [Math.floor(Math.random() * 6) + 1, Math.floor(Math.random() * 6) + 1];
}

export function makeMove(
  state: Readonly<IMatchState>,
  move: IMove,
  stdout: STDIO
): IMatchState {
  let board = applyMove(state.board, move, getCurrentSide(state));

  if (isGameOver(board)) {
    let n = 0;
    let { x, o } = state.points;
    if (getCurrentSide(state) === PlayerSide.X) {
      n = getPoints(board.o);
      x += n;
    } else {
      n = getPoints(board.x);
      o += n;
    }
    let newState = showBoard(
      {
        ...state,
        board,
        dice: undefined,
        gameState: GameState.Over,
        points: { x, o },
      },
      stdout
    );
    stdout(`Game complete. ${newState.inTurn.name} wins ${n} point`);
    return newState;
  }

  return showBoard({ ...swapTurn(state), board, dice: undefined }, stdout);
}

export function isGameOver(board: IBoard) {
  return board.x.off === 15 || board.o.off === 15;
}

export function getPoints(opponent: ICheckerLayout) {
  if (opponent.off) {
    // single
    return 1;
  }
  if (
    opponent.bar ||
    opponent[24] ||
    opponent[23] ||
    opponent[22] ||
    opponent[21] ||
    opponent[20] ||
    opponent[19]
  ) {
    // backgammon
    return 3;
  }
  // gammon
  return 2;
}
