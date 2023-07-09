import { Position } from "./Position";
import { BoardContent, CastlingRights, Color, EMPTY_SQUARE, PositionOrCoordinate } from "./types";
import { parseFenString } from "./parse";

export interface FenArgs {
  board: BoardContent[][];
  toMove: Color;
  castlingRights: CastlingRights;
  enPassantSquare: string;
  halfMoves: number;
  fullMoves: number;
}

export class Fen {
  public static readonly startingPosition =
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  public static readonly emptyPosition = "8/8/8/8/8/8/8/8 w KQkq - 0 1";

  readonly rows: number;
  readonly columns: number;
  readonly board: BoardContent[][];
  readonly toMove: Color;
  readonly castlingRights: CastlingRights;
  readonly enPassantSquare: string;
  readonly halfMoves: number;
  readonly fullMoves: number;

  constructor(fenOrFenArgs: string | FenArgs = Fen.startingPosition) {
    const fenArgs: FenArgs =
      typeof fenOrFenArgs === "string" ? parseFenString(fenOrFenArgs) : fenOrFenArgs;

    this.board = fenArgs.board;
    this.toMove = fenArgs.toMove;
    this.castlingRights = fenArgs.castlingRights;
    this.enPassantSquare = fenArgs.enPassantSquare;
    this.halfMoves = fenArgs.halfMoves;
    this.fullMoves = fenArgs.fullMoves;
    this.rows = this.board.length;
    this.columns = this.board[0].length;
  }

  public static from(fen: Fen): Fen {
    return new Fen(fen.toString());
  }

  public cloneWith(partialFenArgs?: Partial<FenArgs>) {
    return new Fen({
      board: this.board,
      toMove: this.toMove,
      castlingRights: this.castlingRights,
      enPassantSquare: this.enPassantSquare,
      halfMoves: this.halfMoves,
      fullMoves: this.fullMoves,
      ...partialFenArgs,
    });
  }

  public isOccupied(positionOrCoordinate: PositionOrCoordinate): boolean {
    return !this.isEmpty(positionOrCoordinate);
  }

  public isEmpty(positionOrCoordinate: PositionOrCoordinate): boolean {
    const positionContent = this.get(positionOrCoordinate);
    return positionContent === null || positionContent === EMPTY_SQUARE;
  }

  public get(positionOrCoordinate: Position | string): BoardContent | null {
    const position = Position.fromPositionOrCoordinate(positionOrCoordinate);
    const column = this.board[position.y];
    return column ? column[position.x] : null;
  }

  public update(positionOrCoordinate: PositionOrCoordinate, boardContent: BoardContent): Fen {
    const position = Position.fromPositionOrCoordinate(positionOrCoordinate);

    return this.cloneWith({
      board: this.board.map((row, y) => {
        if (y === position.y) {
          return row.map((placement, x) => (x === position.x ? boardContent : placement));
        }

        return y === position.y
          ? row.map((placement, x) => (x === position.x ? boardContent : placement))
          : row;
      }),
    });
  }

  public clear(positionOrCoordinate: string | Position): Fen {
    return this.update(positionOrCoordinate, EMPTY_SQUARE);
  }

  public toString(): string {
    return [
      this.unparseBoard(),
      this.unparseToMove(),
      this.unparseCastlingRights(),
      this.unparseEnPassantSquare(),
      this.unparseHalfMoves(),
      this.unparseFullMoves(),
    ].join(" ");
  }

  public printBoard(): void {
    const edge = Array(this.rows + 2)
      .fill("-")
      .join("-");
    const boardString = this.board
      .map(
        (row) =>
          "| " +
          row
            .map((boardContent) => (boardContent === EMPTY_SQUARE ? "." : boardContent.toString()))
            .join(" ") +
          " |"
      )
      .join("\n");

    console.log(edge + "\n" + boardString + "\n" + edge);
  }

  private unparseBoard(): string {
    return this.board
      .map((pieces) => {
        const field = [];
        let emptySquares = 0;

        pieces.forEach((piece) => {
          if (piece === EMPTY_SQUARE) {
            emptySquares++;
          } else {
            if (emptySquares > 0) {
              field.push(emptySquares);
              field.push(piece);
              emptySquares = 0;
            } else {
              field.push(piece);
            }
          }
        });

        if (emptySquares > 0) {
          field.push(emptySquares);
        }

        return field.reduce((strings, string) => strings + string);
      })
      .join("/");
  }

  private unparseToMove(): string {
    return this.toMove === "white" ? "w" : "b";
  }

  private unparseCastlingRights(): string {
    const castlingRights = this.castlingRights;
    let fenCastlingRights = castlingRights.white.kingside ? "K" : "";
    fenCastlingRights += castlingRights.white.queenside ? "Q" : "";
    fenCastlingRights += castlingRights.black.kingside ? "k" : "";
    fenCastlingRights += castlingRights.black.queenside ? "q" : "";
    return fenCastlingRights ? fenCastlingRights : "-";
  }

  private unparseEnPassantSquare(): string {
    return this.enPassantSquare;
  }

  private unparseHalfMoves(): string {
    return this.halfMoves.toString();
  }

  private unparseFullMoves(): string {
    return this.fullMoves.toString();
  }
}

export default Fen;
