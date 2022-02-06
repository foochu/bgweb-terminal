import {
  Dice,
  IBoard,
  ICheckerLayout,
  ICheckerPlay,
  IMove,
  IScoredMove,
  PlayerSide,
} from "../types";

function exec_wasm_get_moves(input: string): string {
  if (!window.wasm_get_moves) {
    throw new Error("wasm_get_moves not registered");
  }
  return window.wasm_get_moves(input);
}

export async function getAllMoves(
  board: IBoard,
  player: PlayerSide,
  dice: Dice
): Promise<IMove[]> {
  return await _getBestMoves(board, player, dice, 0, false);
}

export async function getBestMoves(
  board: IBoard,
  player: PlayerSide,
  dice: Dice
): Promise<IScoredMove[]> {
  return await _getBestMoves(board, player, dice, 9, true);
}

async function _getBestMoves(
  board: IBoard,
  player: PlayerSide,
  dice: Dice,
  maxMoves: number,
  scoreMoves: boolean
): Promise<IScoredMove[]> {
  let res = JSON.parse(
    exec_wasm_get_moves(
      JSON.stringify({
        board: { x: mapLayout(board.x), o: mapLayout(board.o) },
        dice: [dice[0], dice[1]],
        player: player === PlayerSide.X ? "x" : "o",
        "max-moves": maxMoves,
        "score-moves": scoreMoves,
      })
    )
  );
  if (res.error) {
    throw new Error(`wasm error: ${res.error}`);
  }
  const data: any[] = res;
  return data.map(({ play, ...rest }) => {
    return { ...rest, play: mapPlay(play) };
  });
}

function mapLayout(layout: ICheckerLayout): any {
  return {
    "1": layout[1] || undefined,
    "2": layout[2] || undefined,
    "3": layout[3] || undefined,
    "4": layout[4] || undefined,
    "5": layout[5] || undefined,
    "6": layout[6] || undefined,
    "7": layout[7] || undefined,
    "8": layout[8] || undefined,
    "9": layout[9] || undefined,
    "10": layout[10] || undefined,
    "11": layout[11] || undefined,
    "12": layout[12] || undefined,
    "13": layout[13] || undefined,
    "14": layout[14] || undefined,
    "15": layout[15] || undefined,
    "16": layout[16] || undefined,
    "17": layout[17] || undefined,
    "18": layout[18] || undefined,
    "19": layout[19] || undefined,
    "20": layout[20] || undefined,
    "21": layout[21] || undefined,
    "22": layout[22] || undefined,
    "23": layout[23] || undefined,
    "24": layout[24] || undefined,
    bar: layout.bar || undefined,
  };
}

function mapPlay(play: any[]): ICheckerPlay[] {
  return play.map(({ from, to }) => {
    if (from !== "bar") {
      from = parseInt(from, 10);
    }
    if (to !== "off") {
      to = parseInt(to, 10);
    }
    return { from, to };
  });
}
