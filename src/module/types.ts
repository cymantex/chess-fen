import {Position} from "./Position";

export type Coordinate2D = {
    x: number,
    y: number
}
export enum PieceShortName {
    p = "p", n = "n", b = "b", r = "r", q = "q", k = "k",
    P = "P", N = "N", B = "B", R = "R", Q = "Q", K = "K"
}
export enum PieceLongName {
    WhitePawn = "WhitePawn", WhiteKnight = "WhiteKnight", WhiteBishop = "WhiteBishop", WhiteRook = "WhiteRook",
    WhiteQueen = "WhiteQueen", WhiteKing = "WhiteKing", BlackPawn =  "BlackPawn", BlackKnight = "BlackKnight",
    BlackBishop = "BlackBishop", BlackRook = "BlackRook", BlackQueen = "BlackQueen", BlackKing = "BlackKing"
}
export enum PlayerColor {
    White = "White", Black = "Black"
}
export type CastlingRights = {
    white: {
        queenside: boolean,
        kingside: boolean
    },
    black: {
        queenside: boolean,
        kingside: boolean
    }
};

const {p, n, b, r, q, k, P, N, B, R, Q, K} = PieceShortName;
const {
    WhitePawn, WhiteKnight, WhiteBishop, WhiteRook, WhiteQueen, WhiteKing,
    BlackPawn, BlackKnight, BlackBishop, BlackRook, BlackQueen, BlackKing
} = PieceLongName;

export const pieceLongNameToShort = (pieceName: PieceLongName | string): PieceShortName => {
    if(pieceName in PieceLongName){
        const longToShort: {[key: string]: PieceShortName} = {
            WhitePawn: P,
            WhiteKnight: N,
            WhiteBishop: B,
            WhiteRook: R,
            WhiteQueen: Q,
            WhiteKing: K,
            BlackPawn: p,
            BlackKnight: n,
            BlackBishop: b,
            BlackRook: r,
            BlackQueen: q,
            BlackKing: k
        };

        return longToShort[pieceName];
    }

    throw new Error("Unknown piece " + pieceName);
};
export const pieceShortNameToLong = (pieceName: PieceShortName | string): PieceLongName => {
    if(pieceName in PieceShortName){
        const longToShort: {[key: string]: PieceLongName} = {
            p: BlackPawn,
            n: BlackKnight,
            b: BlackBishop,
            r: BlackRook,
            q: BlackQueen,
            k: BlackKing,
            P: WhitePawn,
            N: WhiteKnight,
            B: WhiteBishop,
            R: WhiteRook,
            Q: WhiteQueen,
            K: WhiteKing
        };

        return longToShort[pieceName];
    }

    throw new Error("Unknown piece " + pieceName);
};

export type PositionOrCoordinate = string | Position;
export type PositionContent = PieceLongName | "EmptySquare" | "OutsideBoard";