import { Position } from "./Position";

export type Coordinate2D = {
  x: number;
  y: number;
};

export type Color = "white" | "black";
export const EMPTY_SQUARE = " " as const;

export const PIECES = {
  p: "p",
  n: "n",
  b: "b",
  r: "r",
  q: "q",
  k: "k",
  P: "P",
  N: "N",
  B: "B",
  R: "R",
  Q: "Q",
  K: "K",
} as const;
export type Piece = (typeof PIECES)[keyof typeof PIECES];

export const BOARD_CONTENT = { ...PIECES, [EMPTY_SQUARE]: EMPTY_SQUARE } as const;
export type BoardContent = (typeof BOARD_CONTENT)[keyof typeof BOARD_CONTENT];

export type CastlingRight = {
  queenside: boolean;
  kingside: boolean;
};
export type CastlingRights = Record<Color, CastlingRight>;
export type PositionOrCoordinate = Position | string;
