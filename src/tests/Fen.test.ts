import { Fen } from "../module/Fen";
import { BOARD_CONTENT } from "../module/types";
import { InvalidFenError } from "../module/InvalidFenError";

describe("Validation", () => {
  it("Should throw InvalidFenError if FEN does not have 6 fields", () => {
    expect(() => new Fen(Fen.startingPosition + " foo")).toThrow(InvalidFenError);
  });

  it("Should throw InvalidFenError if player to move is not w or b", () => {
    expect(() => new Fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1")).toThrow(
      InvalidFenError
    );
  });

  it("Should throw InvalidFenError if castling availability is not in [KQkq-]", () => {
    expect(() => new Fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkqFOO - 0 1")).toThrow(
      InvalidFenError
    );
  });

  it("Should throw InvalidFenError if en passant square is not a coordinate or -.", () => {
    expect(() => new Fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq a0 0 1")).toThrow(
      InvalidFenError
    );
  });

  it("Should throw InvalidFenError if half move number is not a positive integer", () => {
    expect(() => new Fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - a 1")).toThrow(
      InvalidFenError
    );
  });

  it("Should throw InvalidFenError if full move number is not a positive integer", () => {
    expect(() => new Fen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 a")).toThrow(
      InvalidFenError
    );
  });

  it("Should throw InvalidFenError if board contains a letter which is not a piece or empty square", () => {
    expect(() => new Fen("rnbqkbnr/ppppxppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")).toThrow(
      InvalidFenError
    );
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
      fullMoves: fen.fullMoves,
    });

    expect(fenFromArgs.toString()).toBe(Fen.startingPosition);
  });

  it("Should serialize to string", () => {
    const fen = new Fen(Fen.startingPosition);

    expect(fen.toString()).toBe(Fen.startingPosition);
  });
});

describe("Public helper functions", () => {
  it("update", () => {
    const fen = new Fen();
    expect(fen.update("e1", BOARD_CONTENT.b).toString()).toBe(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQbBNR w KQkq - 0 1"
    );
  });

  it("clear", () => {
    const fen = new Fen();
    expect(fen.clear("e1").toString()).toBe(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQ1BNR w KQkq - 0 1"
    );
  });

  it("get", () => {
    const newFen = new Fen();

    expect(newFen.get("e2")).toBe(BOARD_CONTENT.P);
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

  console.log(new Fen());
});
