import { applyMove } from "./applymove";
import { getAllMoves } from "../api";
import { IMove, IBoard, PlayerSide, Dice, ICheckerLayout } from "../types";

export async function isLegalMove(
  board: IBoard,
  player: PlayerSide,
  dice: Dice,
  move: IMove
): Promise<boolean> {
  let legalMoves = await getAllMoves(board, player, dice);
  let candidate = applyMove(board, move, player);
  for (let lm of legalMoves) {
    let option = applyMove(board, lm, player);
    if (boardsEqual(candidate, option)) {
      return true;
    }
  }
  return false;
}

function boardsEqual(a: IBoard, b: IBoard): boolean {
  function layoutsEqual(a: ICheckerLayout, b: ICheckerLayout): boolean {
    for (let i = 1; i < 25; i++) {
      if ((a[i] || 0) !== (b[i] || 0)) {
        return false;
      }
    }
    return (a.bar || 0) === (b.bar || 0);
  }
  return layoutsEqual(a.x, b.x) && layoutsEqual(a.o, b.o);
}
