import { InvalidFenError } from "./InvalidFenError";

export function validateFen(fenTokens: string[]): void {
  if (fenTokens.length !== 6) {
    throw InvalidFenError.invalidNumberOfFields();
  } else if (!/^([wb])$/.test(fenTokens[1])) {
    throw InvalidFenError.invalidToMove();
  } else if (!isCastlingAvailability(fenTokens[2])) {
    throw InvalidFenError.invalidCastlingAvailability();
  } else if (!isEnPassantSquare(fenTokens[3])) {
    throw InvalidFenError.invalidEnPassantSquare();
  } else if (!isPositiveInteger(fenTokens[4])) {
    throw InvalidFenError.invalidHalfMoveNumber();
  } else if (!isPositiveInteger(fenTokens[5])) {
    throw InvalidFenError.invalidMoveNumber();
  }
}

const isPositiveInteger = (string: string) => {
  return /[0-9]/.test(string);
};

const isEnPassantSquare = (string: string) => {
  return /^(-|[a-h][36])$/.test(string);
};

const isCastlingAvailability = (string: string) => {
  return /^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(string);
};
