import {FindPiecesMovableTo, StandardNotation} from "../module/StandardNotation";
import {blackLongCastling, blackShortCastling, whiteLongCastling, whiteShortCastling} from "../module/utils";
import {ChessBoard} from "../module/ChessBoard";
import Fen from "../module/Fen";
import {Color, BoardContent} from "../module/types";

const createFindPiecesMovableTo = (fen: Fen, color: Color): FindPiecesMovableTo => (to, pieceName) => {
    const chessBoard = new ChessBoard(fen.board);
    return chessBoard
        .getPiecesMovableTo(to)
        .filter(piece => piece.color === color)
        .filter(piece => piece.name === pieceName);
};

describe("Special moves", () => {
    it("Should allow short castling", () => {
        const notation = new StandardNotation("0-0");

        expect(notation.toMoveArgs("black")).toEqual(blackShortCastling);
        expect(notation.toMoveArgs("white")).toEqual(whiteShortCastling);
    });

    it("Should allow long castling", () => {
        const notation = new StandardNotation("0-0-0");

        expect(notation.toMoveArgs("black")).toEqual(blackLongCastling);
        expect(notation.toMoveArgs("white")).toEqual(whiteLongCastling);
    });

    it("Should allow promotion", () => {
        const notation = new StandardNotation("e7-e8Q");

        expect(notation.toMoveArgs()).toEqual({
            from: "e7",
            to: "e8",
            options: {
                promotion: "queen"
            }
        });
    });
});

describe("Regular moves", () => {
    it("Should allow long notation", () => {
        const notation = new StandardNotation("e2-e4+!?");

        expect(notation.toMoveArgs()).toEqual({from: "e2", to: "e4"});
    });

    it("Should allow short notation", () => {
        const fen = new Fen(Fen.startingPosition);
        const findPiecesMovableTo = createFindPiecesMovableTo(fen, "white");
        const notation = new StandardNotation("e4", findPiecesMovableTo);

        expect(notation.toMoveArgs()).toEqual({from: "e2", to: "e4"});
    });

    it("Should allow short notation with specifier", () => {
        const fen = new Fen(Fen.startingPosition)
            .update("f3", BoardContent.WhiteKnight)
            .clear("d2")
            .update("b6", BoardContent.BlackKnight)
            .clear("d7");
        const nbd2 = new StandardNotation("Nbd2", createFindPiecesMovableTo(fen, "white"));
        const nfd2 = new StandardNotation("Nfd2", createFindPiecesMovableTo(fen, "white"));
        const n8d7 = new StandardNotation("N8d7", createFindPiecesMovableTo(fen, "black"));
        const n6d7 = new StandardNotation("N6d7", createFindPiecesMovableTo(fen, "black"));

        expect(nbd2.toMoveArgs()).toEqual({from: "b1", to: "d2"});
        expect(nfd2.toMoveArgs()).toEqual({from: "f3", to: "d2"});
        expect(n8d7.toMoveArgs()).toEqual({from: "b8", to: "d7"});
        expect(n6d7.toMoveArgs()).toEqual({from: "b6", to: "d7"});
    });

    it("Should throw if short notation is given without findPiecesMovableTo", () => {
        expect(() => new StandardNotation("e4")).toThrow();
    });

    it("Should throw if target square cannot be reached", () => {
        const fen = new Fen(Fen.emptyPosition);
        const findPiecesMovableTo = createFindPiecesMovableTo(fen, "white");

        expect(() => new StandardNotation("e4", findPiecesMovableTo)).toThrow();
    });

    it("Should throw if notation is ambiguous", () => {
        const fen = new Fen(Fen.emptyPosition)
            .update("a1", BoardContent.WhiteRook)
            .update("c1", BoardContent.WhiteRook);
        const findPiecesMovableTo = createFindPiecesMovableTo(fen, "white");

        expect(() => new StandardNotation("Rb1", findPiecesMovableTo)).toThrow();
    });
});

describe("Erroneous moves", () => {
    it("Should throw if x-axis is not between a-h", () => {
        expect(() => new StandardNotation("i4")).toThrow();
    });

    it("Should throw if y-axis is not between 1-9", () => {
        expect(() => new StandardNotation("a0")).toThrow();
    });
});