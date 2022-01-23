export type STDIO = (msg: string) => void;

export interface IBoard {
  x: ICheckerLayout;
  o: ICheckerLayout;
}

export type Dice = number[];

export interface ICheckerLayout {
  [index: number]: number;
  bar?: number;
  off?: number;
}

export interface IMove {
  play: ICheckerPlay[];
}

export interface IScoredMove extends IMove {
  evaluation: IEvaluation;
}

export interface ICheckerPlay {
  from: number | "bar";
  to: number | "off";
}

export interface IEvaluation {
  info: { cubeful: boolean; plies: number };
  eq: number;
  diff: number;
  probability: IProbability;
}

export interface IProbability {
  win: number;
  winG: number;
  winBG: number;
  lose: number;
  loseG: number;
  loseBG: number;
}

export interface IMatchState {
  players: { x: IPlayer; o: IPlayer };
  board: IBoard;
  dice?: Dice;
  inTurn: IPlayer; // who makes the next decision
  onRoll: IPlayer; // player on roll
  gameState: GameState;
  cube?: number;
  cubeOwner?: IPlayer;
  matchTo?: number;
  beavers?: boolean;
  doubled?: boolean;
  resigned?: number;
  resignationDeclined?: number;
  points: { x: number; o: number };
}

export enum GameState {
  None,
  Playing,
  Over,
  Resigned,
  Drop,
}

export interface IPlayer {
  name: string;
  type: PlayerType;
}

export enum PlayerSide {
  X,
  O,
}

export enum PlayerType {
  Human,
  Computer,
}
