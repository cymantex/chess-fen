import {ChessBoard} from "../module/ChessBoard";
import {ColoredPiece, PositionContent} from "../module/types";
import Fen from "../module/Fen";
import {expectEqualIgnoreOrder} from "./utils";

describe("controlledSquares", () => {
    const getControlledCoordinates = (board: PositionContent[][]) => new ChessBoard(board).controlledSquares;

    it("Should find squares controlled by pawns", () => {
        const fen = new Fen(Fen.emptyPosition)
            .update("e2", ColoredPiece.WhitePawn)
            .update("a4", ColoredPiece.WhitePawn)
            .update("e7", ColoredPiece.BlackPawn)
            .update("b5", ColoredPiece.BlackPawn);

        const controlledSquares = getControlledCoordinates(fen.board);

        expectEqualIgnoreOrder(controlledSquares.white, ["b5", "d3", "f3"]);
        expectEqualIgnoreOrder(controlledSquares.black, ["d6", "f6", "a4", "c4"]);
    });

    it("Should find squares controlled by knights", () => {
        const fen = new Fen(Fen.emptyPosition)
            .update("e2", ColoredPiece.WhiteKnight)
            .update("c4", ColoredPiece.WhiteKnight)
            .update("e7", ColoredPiece.BlackKnight)
            .update("d6", ColoredPiece.BlackKnight);

        const controlledSquares = getControlledCoordinates(fen.board);

        expectEqualIgnoreOrder(controlledSquares.white, [
            "b6", "d6", "a5", "e5", "d4", "f4", "a3", "c3", "e3", "g3", "b2", "d2", "c1", "g1"
        ]);
        expectEqualIgnoreOrder(controlledSquares.black, [
            "c8", "e8", "g8", "b7", "f7", "c6", "g6", "b5", "d5", "f5", "c4", "e4"
        ]);
    });

    it("Should find squares controlled by rooks", () => {
        const fen = new Fen(Fen.emptyPosition)
            .update("e2", ColoredPiece.WhiteRook)
            .update("e7", ColoredPiece.BlackRook);

        const controlledSquares = getControlledCoordinates(fen.board);

        expectEqualIgnoreOrder(controlledSquares.white, [
            "e7", "e6", "e5", "e4", "e3", "a2", "b2", "c2", "d2", "f2", "g2", "h2", "e1"
        ]);
        expectEqualIgnoreOrder(controlledSquares.black, [
            "e8", "a7", "b7", "c7", "d7", "f7", "g7", "h7", "e6", "e5", "e4", "e3", "e2"
        ]);
    });

    it("Should find squares controlled by bishops", () => {
        const fen = new Fen(Fen.emptyPosition)
            .update("e2", ColoredPiece.WhiteBishop)
            .update("g4", ColoredPiece.BlackBishop);

        const controlledSquares = getControlledCoordinates(fen.board);

        expectEqualIgnoreOrder(controlledSquares.white, [
            "a6", "b5", "c4", "d3", "f1",
            "g4", "f3", "d1"
        ]);
        expectEqualIgnoreOrder(controlledSquares.black, [
            "c8", "d7", "e6", "f5",
            "h3", "h5", "f3", "e2"
        ]);
    });

    it("Should find squares controlled by queens", () => {
        const fen = new Fen(Fen.emptyPosition)
            .update("e2", ColoredPiece.WhiteQueen)
            .update("e7", ColoredPiece.BlackQueen);

        const controlledSquares = getControlledCoordinates(fen.board);

        expectEqualIgnoreOrder(controlledSquares.white, [
            "a6", "b5", "c4", "d3", "f1",
            "h5", "g4", "f3", "d1",
            "e7", "e6", "e5", "e4", "e3", "e1",
            "a2", "b2", "c2", "d2", "f2", "g2", "h2"
        ]);
        expectEqualIgnoreOrder(controlledSquares.black, [
            "d8", "f6", "g5", "h4",
            "f8", "d6", "c5", "b4", "a3",
            "a7", "b7", "c7", "d7", "f7", "g7", "h7",
            "e8", "e6", "e5", "e4", "e3", "e2"
        ]);
    });

    it("Should find squares controlled by kings", () => {
        const fen = new Fen(Fen.emptyPosition)
            .update("e2", ColoredPiece.WhiteKing)
            .update("h8", ColoredPiece.BlackKing);

        const controlledSquares = getControlledCoordinates(fen.board);

        expectEqualIgnoreOrder(controlledSquares.white, ["d3", "e3", "f3", "d2", "f2", "d1", "e1", "f1"]);
        expectEqualIgnoreOrder(controlledSquares.black, ["g8", "g7", "h7"]);
    });

    it("Should find squares controlled in starting position", () => {
        const fen = new Fen(Fen.startingPosition);

        const controlledSquares = getControlledCoordinates(fen.board);

        expectEqualIgnoreOrder(controlledSquares.white, [
            "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
            "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
            "b1", "c1", "d1", "e1", "f1", "g1"
        ]);
        expectEqualIgnoreOrder(controlledSquares.black, [
            "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
            "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
            "b8", "c8", "d8", "e8", "f8", "g8"
        ]);
    });
});

describe("map", () => {
    describe("pieceData", () => {
        it("Should set not set pieceData for empty square", () => {
            const fen = new Fen(Fen.startingPosition);

            const chessBoard = new ChessBoard(fen.board);

            expect(chessBoard.get("e4").pieceData).toBeUndefined();
        });

        it("Should set location", () => {
            const fen = new Fen(Fen.startingPosition);

            const chessBoard = new ChessBoard(fen.board);

            expect(chessBoard.getPiece("e2").location).toBe("e2");
        });

        it("Should set name", () => {
            const fen = new Fen(Fen.startingPosition);

            const chessBoard = new ChessBoard(fen.board);

            expect(chessBoard.getPiece("e2").name).toBe("pawn");
        });

        it("Should set color", () => {
            const fen = new Fen(Fen.startingPosition);

            const chessBoard = new ChessBoard(fen.board);

            expect(chessBoard.getPiece("e2").location).toBe("e2");
        });

        it("Should find possible moves for pawns", () => {
            const fen = new Fen(Fen.startingPosition)
                .update("f3", ColoredPiece.BlackPawn);

            const chessBoard = new ChessBoard(fen.board);

            expectEqualIgnoreOrder(chessBoard.getPiece("e2").moves, ["e3", "e4", "f3"]);
            expectEqualIgnoreOrder(chessBoard.getPiece("f3").moves, ["e2", "g2"]);
        });

        it("Should find possible moves for kings", () => {
            const fen = new Fen(Fen.startingPosition)
                .update("a8", ColoredPiece.WhiteKing);

            const chessBoard = new ChessBoard(fen.board);

            expectEqualIgnoreOrder(chessBoard.getPiece("a8").moves, ["a7", "b8"]);
            expectEqualIgnoreOrder(chessBoard.getPiece("e8").moves, []);
        });

        it("Should find possible moves for knights", () => {
            const fen = new Fen(Fen.startingPosition)
                .update("b6", ColoredPiece.BlackKnight)
                .clear("d7");

            const chessBoard = new ChessBoard(fen.board);

            expectEqualIgnoreOrder(chessBoard.getPiece("b8").moves, ["a6", "c6", "d7"]);
            expectEqualIgnoreOrder(chessBoard.getPiece("b6").moves, ["d7", "d5", "c4", "a4"]);
        });

        it("Should set king as in check", () => {
            const fen = new Fen(Fen.startingPosition)
                .clear("e2")
                .clear("e7")
                .update("e4", ColoredPiece.BlackRook);

            const chessBoard = new ChessBoard(fen.board);

            expect(chessBoard.getPiece("e1").inCheck).toBeTruthy();
            expect(chessBoard.getPiece("e8").inCheck).toBeFalsy();
        });

        it("Should find pieces movable to square", () => {
            const fen = new Fen(Fen.startingPosition);

            const chessBoard = new ChessBoard(fen.board);

            expectEqualIgnoreOrder(chessBoard.getPiecesMovableTo("e4").map(piece => piece.location), ["e2"]);
            expectEqualIgnoreOrder(chessBoard.getPiecesMovableTo("a1").map(piece => piece.location), []);
        })
    });

    describe("squareData", () => {
        it("should set coordinate", () => {
            const fen = new Fen(Fen.startingPosition);

            const chessBoard = new ChessBoard(fen.board);

            expect(chessBoard.get("d4").coordinate).toBe("d4");
        });

        it("Should set uncontrolled square as uncontrolled", () => {
            const fen = new Fen(Fen.startingPosition);

            const chessBoard = new ChessBoard(fen.board);

            expect(chessBoard.isControlledSquare("d4", "white")).toBeFalsy();
            expect(chessBoard.isControlledSquare("d4", "black")).toBeFalsy();
            expect(chessBoard.isControlledSquare("d4")).toBeFalsy();
        });

        it("Should set controlled square as controlled", () => {
            const fen = new Fen(Fen.startingPosition);

            const chessBoard = new ChessBoard(fen.board);

            expect(chessBoard.isControlledSquare("d3", "white")).toBeTruthy();
            expect(chessBoard.isControlledSquare("d6", "black")).toBeTruthy();
            expect(chessBoard.isControlledSquare("d3")).toBeTruthy();
        });
    });
});