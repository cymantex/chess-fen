import { BoardContent, CastlingRights, Color, EMPTY_SQUARE, Piece, PIECES } from "./types";
import { InvalidFenError } from "./InvalidFenError";
import { FenArgs } from "./Fen";
import { validateFen } from "./validate";

export function parseFenString(fen: string): FenArgs {
  const fenTokens = fen.split(" ");
  validateFen(fenTokens);

  return {
    board: parseBoard(fenTokens),
    toMove: parseToMove(fenTokens),
    castlingRights: parseCastlingRights(fenTokens),
    enPassantSquare: parseEnPassantSquare(fenTokens),
    halfMoves: parseHalfMoves(fenTokens),
    fullMoves: parseFullMoves(fenTokens),
  };
}

function parseBoardChar(fenTokens: string[], notation: Piece | string): BoardContent[] {
  if (notation.match(/\d/)) {
    return Array(parseInt(notation, 10)).fill(EMPTY_SQUARE);
  } else if (notation in PIECES) {
    return [PIECES[notation as Piece]];
  }

  throw new InvalidFenError(fenTokens.join(" "));
}

function parseBoard(fenTokens: string[]): BoardContent[][] {
  return fenTokens[0].split("/").map((field) => {
    const piecePlacements: BoardContent[] = [];

    for (let i = 0; i < field.length; i++) {
      piecePlacements.push(...parseBoardChar(fenTokens, field.charAt(i)));
    }

    return piecePlacements;
  });
}

function parseToMove(fenTokens: string[]): Color {
  return fenTokens[1] === "w" ? "white" : "black";
}

function parseCastlingRights(fenTokens: string[]): CastlingRights {
  return {
    white: {
      queenside: fenTokens[2].includes("Q"),
      kingside: fenTokens[2].includes("K"),
    },
    black: {
      queenside: fenTokens[2].includes("q"),
      kingside: fenTokens[2].includes("k"),
    },
  };
}

function parseHalfMoves(fenTokens: string[]): number {
  return parseInt(fenTokens[4], 10);
}

function parseFullMoves(fenTokens: string[]): number {
  return parseInt(fenTokens[5], 10);
}

function parseEnPassantSquare(fenTokens: string[]): string {
  return fenTokens[3];
}
