import { IBoard, ICheckerLayout } from "../types";

export function positionIdFromBoard(board: IBoard): string {
  let auchKey = Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  let bit = 0;
  function addBits(bitPos: number, bits: number) {
    let k = Math.floor(bitPos / 8);
    let r = bitPos & 0x7;
    let b = ((0x1 << bits) - 1) << r;

    auchKey[k] |= b;
    if (k < 8) {
      auchKey[k + 1] |= b >> 8;
      auchKey[k + 2] |= b >> 16;
    } else if (k === 8) {
      auchKey[k + 1] |= b >> 8;
    }
  }
  function layout(layout: ICheckerLayout) {
    for (let i = 1; i < 26; i++) {
      let nc = i < 25 ? layout[i] : layout.bar;
      if (nc) {
        addBits(bit, nc);
        bit += nc + 1;
      } else {
        ++bit;
      }
    }
  }
  layout(board.o);
  layout(board.x);

  let puch = auchKey;
  let szID: string[] = [];

  let aszBase64 =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  for (let i = 0; i < 3; i++) {
    szID.push(aszBase64[puch[0] >> 2]);
    szID.push(aszBase64[((puch[0] & 0x03) << 4) | (puch[1] >> 4)]);
    szID.push(aszBase64[((puch[1] & 0x0f) << 2) | (puch[2] >> 6)]);
    szID.push(aszBase64[puch[2] & 0x3f]);

    puch = puch.slice(3);
  }

  szID.push(aszBase64[puch[0] >> 2]);
  szID.push(aszBase64[(puch[0] & 0x03) << 4]);

  return szID.join("");
}
