import {Position} from "./Position";
import {Fen} from "./Fen";
import {FenPiece, MoveArgs, Piece, ColoredPiece, PositionContent, PositionContentEvents, Color} from "./types";
import {InvalidFenError} from "./InvalidFenError";

const traverse = {
    from: (from: number) => ({
        to: (to: number) => ({
            searchFor: (predicate: ((i: number, from?: number, to?: number) => boolean)|((i: number) => boolean)) => {
                if(from < to){
                    for(let i = from + 1; i < to; i++){
                        if(predicate(i, from, to)){
                            return true;
                        }
                    }
                } else {
                    for(let i = from - 1; i > to; i--){
                        if(predicate(i)){
                            return true;
                        }
                    }
                }

                return false;
            }
        })
    })
};

const isObstructedDiagonalPath = (fromPosition: Position, toPosition: Position, fen: Fen) => {
    return traverse
        .from(fromPosition.y)
        .to(toPosition.y)
        .searchFor((y: number) => traverse
            .from(fromPosition.x)
            .to(toPosition.x)
            .searchFor((x: number) =>
                fromPosition.isDiagonalTo(new Position(x, y)) &&
                fen.isOccupied(new Position(x, y)))
        );
};


const isObstructedVerticalPath = (fromPosition: Position, toPosition: Position, fen: Fen) => {
    return traverse
        .from(fromPosition.y)
        .to(toPosition.y)
        .searchFor((y: number) => fen.isOccupied(new Position(fromPosition.x, y)));
};

const isObstructedHorizontalPath = (fromPosition: Position, toPosition: Position, fen: Fen) => {
    return traverse
        .from(fromPosition.x)
        .to(toPosition.x)
        .searchFor((x: number) => fen.isOccupied(new Position(x, fromPosition.y)));
};

export const isObstructedPath = (fromPosition: Position, toPosition: Position, fen: Fen) => {
    if(fromPosition.isDiagonalTo(toPosition)){
        return isObstructedDiagonalPath(fromPosition, toPosition, fen);
    } else if(fromPosition.isVerticalTo(toPosition)){
        return isObstructedVerticalPath(fromPosition, toPosition, fen);
    } else if(fromPosition.isHorizontalTo(toPosition)){
        return isObstructedHorizontalPath(fromPosition, toPosition, fen);
    }

    return false;
};

export const isPositiveInteger = (string: string) => {
    return /[0-9]/.test(string);
};

export const isCoordinate = (string: string) => {
    return /[a-h][1-8]/.test(string);
};

export const isEnPassantSquare = (string: string) => {
    return /^(-|[a-h][36])$/.test(string);
};

export const isCastlingAvailability = (string: string) => {
    return /^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(string);
};

export const blackShortCastling: MoveArgs = {
    from: "e8",
    to: "g8",
    options: {
        specialMoves: [{
            from: "h8",
            to: "f8"
        }]
    }
};

export const blackLongCastling: MoveArgs = {
    from: "e8",
    to: "c8",
    options: {
        specialMoves: [{
            from: "a8",
            to: "d8"
        }]
    }
};

export const whiteShortCastling: MoveArgs = {
    from: "e1",
    to: "g1",
    options: {
        specialMoves: [{
            from: "h1",
            to: "f1"
        }]
    }
};

export const whiteLongCastling: MoveArgs = {
    from: "e1",
    to: "c1",
    options: {
        specialMoves: [{
            from: "a1",
            to: "d1"
        }]
    }
};

const {p, n, b, r, q, k, P, N, B, R, Q, K} = FenPiece;
const {
    BlackPawn, BlackKnight, BlackBishop, BlackQueen, BlackKing, BlackRook,
    WhitePawn, WhiteKnight, WhiteBishop, WhiteQueen, WhiteKing, WhiteRook
} = ColoredPiece;

export const coloredPieceToFenPiece = (pieceName: ColoredPiece | string): FenPiece => {
    const longToShort: {[key: string]: FenPiece} = {
        "white pawn": P,
        "white knight": N,
        "white bishop": B,
        "white rook": R,
        "white queen": Q,
        "white king": K,
        "black pawn": p,
        "black knight": n,
        "black bishop": b,
        "black rook": r,
        "black queen": q,
        "black king": k
    };

    if(longToShort[pieceName]){
        return longToShort[pieceName];
    }

    throw new Error("Unknown piece " + pieceName);
};

export const fenPieceToColoredPiece = (fenPieceName: FenPiece | string): ColoredPiece => {
    if(fenPieceName in FenPiece){
        const longToShort: {[key: string]: ColoredPiece} = {
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

        return longToShort[fenPieceName];
    }

    throw new InvalidFenError("Unknown piece " + fenPieceName);
};

export const toColoredPiece = (color: Color, piece: Piece): ColoredPiece => {
    return `${color} ${piece}` as ColoredPiece;
};

export const toPiece = (pieces: ColoredPiece|PositionContent): Piece => {
    return pieces.split(" ")[1] as Piece
};

export function positionContentEvent<T>(positionContent: PositionContent,
                                        positionContentEvents: PositionContentEvents<T>): T {
    if(positionContent === "empty"){
        return positionContentEvents.empty(null);
    }

    const color = positionContent.startsWith("white") ? "white" : "black";
    const piece = positionContent.split(" ")[1];

    if(piece in positionContentEvents){
        return positionContentEvents[piece](color);
    }

    return positionContentEvents.defaultEvent(color);
}