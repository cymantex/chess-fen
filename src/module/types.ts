import {Position} from "./Position";

export type Coordinate = string;
export type Color = "white"|"black";
export type Piece = "pawn"|"knight"|"bishop"|"rook"|"queen"|"king";
export type Coordinate2D = {
    x: number,
    y: number
}
export enum FenPiece {
    p = "p", n = "n", b = "b", r = "r", q = "q", k = "k",
    P = "P", N = "N", B = "B", R = "R", Q = "Q", K = "K"
}
export enum ColoredPiece {
    WhitePawn = "white pawn", WhiteKnight = "white knight", WhiteBishop = "white bishop", WhiteRook = "white rook",
    WhiteQueen = "white queen", WhiteKing = "white king", BlackPawn =  "black pawn", BlackKnight = "black knight",
    BlackBishop = "black bishop", BlackRook = "black rook", BlackQueen = "black queen", BlackKing = "black king"
}
export interface CastlingRights {
    white: {
        queenside: boolean,
        kingside: boolean
    },
    black: {
        queenside: boolean,
        kingside: boolean
    }
}

export type PositionOrCoordinate = Position | Coordinate;
export type PositionContent = ColoredPiece | "empty";

export interface PieceData {
    name: Piece,
    color: Color,
    inCheck?: boolean,
    controlledSquares: Coordinate[],
    moves: Coordinate[],
    location: string
}

export interface SquareData {
    coordinate: Coordinate,
    pieceData?: PieceData,
    controlledBy: {
        white: boolean,
        black: boolean
    }
}

export interface MoveOptions {
    updateGameData?: boolean,
    specialMoves?: MoveArgs[],
    promotion?: Piece
}

export interface MoveArgs {
    to: Position|Coordinate,
    from: Position|Coordinate,
    options?: MoveOptions
}

export interface ControlledSquares {
    white: Coordinate[],
    black: Coordinate[]
}

export type PositionContentEvent<T> = (color: Color|null) => T;
export interface PositionContentEvents<T> {
    [piece: string]: PositionContentEvent<T>,
    empty: PositionContentEvent<T>
}