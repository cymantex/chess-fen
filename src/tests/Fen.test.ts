import {Fen} from "../module/Fen";
import {Piece, BoardContent} from "../module/types";
import {InvalidFenError} from "../module/InvalidFenError";
import Position from "../module/Position";

describe("Validation", () => {
    it("Should throw InvalidFenError if FEN does not have 6 fields", () => {
        expect(() => new Fen(Fen.startingPosition + " foo")).toThrow(InvalidFenError);
    });

    it("Should throw InvalidFenError if player to move is not w or b", () => {
        expect(() => new Fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1")).toThrow(InvalidFenError);
    });

    it("Should throw InvalidFenError if castling availability is not in [KQkq-]", () => {
        expect(() => new Fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkqFOO - 0 1")).toThrow(InvalidFenError);
    });

    it("Should throw InvalidFenError if en passant square is not a coordinate or -.", () => {
        expect(() => new Fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq a0 0 1")).toThrow(InvalidFenError);
    });

    it("Should throw InvalidFenError if half move number is not a positive integer", () => {
        expect(() => new Fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - a 1")).toThrow(InvalidFenError);
    });

    it("Should throw InvalidFenError if full move number is not a positive integer", () => {
        expect(() => new Fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 a")).toThrow(InvalidFenError);
    });

    it("Should throw InvalidFenError if board contains a letter which is not a piece or empty square", () => {
        expect(() => new Fen("rnbqkbnr/ppppxppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")).toThrow(InvalidFenError);
    });
});

describe("Creation and serializing", () => {
    it("Should create new Fen from instance", () => {
        const fen = new Fen();

        expect(Fen.from(fen).toString()).toBe(Fen.startingPosition);
    });

    it("Should create new Fen from args", () => {
        const fen = new Fen();
        const fenFromArgs = new Fen({
            board: fen.board,
            toMove: fen.toMove,
            castlingRights: fen.castlingRights,
            enPassantSquare: fen.enPassantSquare,
            halfMoves: fen.halfMoves,
            fullMoves: fen.fullMoves
        });

        expect(fenFromArgs.toString()).toBe(Fen.startingPosition);
    });

    it("Should serialize to string", () => {
        const fen = new Fen();

        expect(fen.toString()).toBe(Fen.startingPosition);
    });
});

describe("Public helper functions", () => {
    console.log(new Fen().move({from: new Position(6, 7), to: new Position(5, 5)}).toString());


    it("update", () => {
        const fen = new Fen();
        expect(fen.update("e1", BoardContent.BlackBishop).toString())
            .toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQbBNR w KQkq - 0 1")
    });

    it("clear", () => {
        const fen = new Fen();
        expect(fen.clear("e1").toString()).toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQ1BNR w KQkq - 0 1");
    });

    it("get", () => {
        const newFen = new Fen();

        expect(newFen.get("e2")).toBe(BoardContent.WhitePawn);
        expect(newFen.get("a0")).toBeNull();
    });

    it("isEmpty", () => {
        const newFen = new Fen();

        expect(newFen.isEmpty("e2")).toBeFalsy();
        expect(newFen.isEmpty("e4")).toBeTruthy();
    });

    it("isOccupied", () => {
        const newFen = new Fen();

        expect(newFen.isOccupied("e2")).toBeTruthy();
        expect(newFen.isOccupied("e4")).toBeFalsy();
    });
});

describe("move", () => {
    it("Should make specified move from MoveArgs", () =>  {
        const fen = new Fen();
        const e4 = fen.move({from: "e2", to: "e4"});
        const c5 = e4.move({from: "c7", to: "c5"});

        expect(e4.toString()).toBe("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
        expect(c5.toString()).toBe("rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2");
    });

    it("Should make special moves", () =>  {
        const fen = new Fen().move({from: "e2", to: "e4", options: {
            specialMoves: [{from: "d2", to: "d4"}, {from: "g1", to: "f3"}]
        }});

        expect(fen.toString()).toBe("rnbqkbnr/pppppppp/8/8/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq e3 0 1");
    });

    it("Should make promotion", () =>  {
        expect(new Fen().move({
            from: "e2",
            to: "e4",
            options: {
                promotion: Piece.Queen
            }
        }).toString()).toBe("rnbqkbnr/pppppppp/8/8/4Q3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
    });

    it("Should throw if from value is outside board", () =>  {
        expect(() => new Fen().move({from: "a0", to: "a8"})).toThrow();
    });

    it("Should throw if to value is outside board", () =>  {
        expect(() => new Fen().move({from: "a1", to: "a0"})).toThrow();
    });

    it("Should make specified move from short notation", () =>  {
        const fen = new Fen();
        const e4 = fen.move("e4");
        const c5 = e4.move("c5");

        expect(e4.toString()).toBe("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
        expect(c5.toString()).toBe("rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2");
    });

    it("Should make move from long notation", () =>  {
        const fen = new Fen();
        const e4 = fen.move("e2-e4");
        const c5 = e4.move("c7-c5");

        expect(e4.toString()).toBe("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
        expect(c5.toString()).toBe("rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2");
    });

    it("Should update full moves", () => {
        expect(new Fen().move("e4").move("c5").fullMoves).toBe(2);
    });

    it("Should update half moves", () => {
        expect(new Fen().move("Nf3").move("Nf6").halfMoves).toBe(2);
        expect(new Fen().move("Qd1xd8").move("Kxd8").halfMoves).toBe(0);
        expect(new Fen().move("e4").move("c5").halfMoves).toBe(0);
    });

    it("Should update player to move", () => {
        expect(new Fen().move("Nf3").toMove).toBe("black");
        expect(new Fen().move("Nf3").move("Nf6").toMove).toBe("white");
    });

    it("Should update en passant square", () => {
        expect(new Fen().move("e4").enPassantSquare).toBe("e3");
        expect(new Fen().move("e4").move("c5").enPassantSquare).toBe("c6");
        expect(new Fen().move("e4").move("c5").move("Nf3").enPassantSquare).toBe("-");
    });

    it("Should update castling rights", () => {
        const fen = new Fen();
        let currentFen = fen.move({from: "h1", to: "h3"});
        expect(currentFen.toString()).toBe("rnbqkbnr/pppppppp/8/8/8/7R/PPPPPPPP/RNBQKBN1 b Qkq - 1 1");
        currentFen = currentFen.move({from: "a8", to: "a6"});
        expect(currentFen.toString()).toBe("1nbqkbnr/pppppppp/r7/8/8/7R/PPPPPPPP/RNBQKBN1 w Qk - 2 2");
        currentFen = currentFen.move({from: "a1", to: "a3"});
        expect(currentFen.toString()).toBe("1nbqkbnr/pppppppp/r7/8/8/R6R/PPPPPPPP/1NBQKBN1 b k - 3 2");
        currentFen = currentFen.move({from: "h8", to: "h6"});
        expect(currentFen.toString()).toBe("1nbqkbn1/pppppppp/r6r/8/8/R6R/PPPPPPPP/1NBQKBN1 w - - 4 3");

        let newFen = new Fen().move({from: "e1", to: "e3"});
        expect(newFen.toString()).toBe("rnbqkbnr/pppppppp/8/8/8/4K3/PPPPPPPP/RNBQ1BNR b kq - 1 1");
        newFen = newFen.move({from: "e8", to: "e6"});
        expect(newFen.toString()).toBe("rnbq1bnr/pppppppp/4k3/8/8/4K3/PPPPPPPP/RNBQ1BNR w - - 2 2")
    });
});