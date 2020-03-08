import {Fen} from "../module/Fen";
import {PieceLongName} from "../module/types";

let fen = new Fen(Fen.startingPosition);

describe("Fen tests", () => {
    beforeEach(() => {
        fen = new Fen(Fen.startingPosition);
    });

    it("Should throw exception if malformed FEN", () => {
        expect(() => new Fen(Fen.startingPosition + " foo")).toThrow();
        expect(() => new Fen("xnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1")).toThrow()
    });

    it("Should create new Fen from instance", () => {
        expect(Fen.from(fen).toString()).toBe(Fen.startingPosition);
    });

    it("Parses and unparses correctly", () => {
        expect(fen.toString()).toBe(Fen.startingPosition);
    });

    it("Properly makes a specified move", () =>  {
        let currentFen = fen.makeMove("e2", "e4");
        expect(currentFen.toString()).toBe("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1");
        currentFen = currentFen.makeMove("c7", "c5");
        expect(currentFen.toString()).toBe("rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2");
        currentFen = currentFen.makeMove("g1", "f3");
        expect(currentFen.toString()).toBe("rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2");
        currentFen = currentFen.makeMove("c5", "c4");
        expect(currentFen.toString()).toBe("rnbqkbnr/pp1ppppp/8/8/2p1P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3");
        currentFen = currentFen.makeMove("h1", "g1");
        expect(currentFen.toString()).toBe("rnbqkbnr/pp1ppppp/8/8/2p1P3/5N2/PPPP1PPP/RNBQKBR1 b Qkq - 1 3");
    });

    it("Properly updates castling rights", () => {
        let currentFen = fen.makeMove("h1", "h3");
        expect(currentFen.toString()).toBe("rnbqkbnr/pppppppp/8/8/8/7R/PPPPPPPP/RNBQKBN1 b Qkq - 1 1");
        currentFen = currentFen.makeMove("a8", "a6");
        expect(currentFen.toString()).toBe("1nbqkbnr/pppppppp/r7/8/8/7R/PPPPPPPP/RNBQKBN1 w Qk - 2 2");
        currentFen = currentFen.makeMove("a1", "a3");
        expect(currentFen.toString()).toBe("1nbqkbnr/pppppppp/r7/8/8/R6R/PPPPPPPP/1NBQKBN1 b k - 3 2");
        currentFen = currentFen.makeMove("h8", "h6");
        expect(currentFen.toString()).toBe("1nbqkbn1/pppppppp/r6r/8/8/R6R/PPPPPPPP/1NBQKBN1 w - - 4 3");

        let newFen = new Fen(Fen.startingPosition).makeMove("e1", "e3");
        expect(newFen.toString())
            .toBe("rnbqkbnr/pppppppp/8/8/8/4K3/PPPPPPPP/RNBQ1BNR b kq - 1 1");
        newFen = newFen.makeMove("e8", "e6");
        expect(newFen.toString()).toBe("rnbq1bnr/pppppppp/4k3/8/8/4K3/PPPPPPPP/RNBQ1BNR w - - 2 2")
    });

    it("Should update position", () => {
        expect(fen.updatePosition("e1", PieceLongName.BlackBishop).toString())
            .toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQBBNR w KQkq - 0 1")
    });

    it("Should clear position", () => {
        expect(fen.clearPosition("e1").toString())
            .toBe("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQ1BNR w KQkq - 0 1");
    });
});