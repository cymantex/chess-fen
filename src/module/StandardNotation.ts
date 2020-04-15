import {Color, MoveArgs, Piece, PieceData} from "./types";
import {InvalidMoveError} from "./InvalidMoveError";
import {blackLongCastling, blackShortCastling, fenPieceToPositionContent, whiteLongCastling, whiteShortCastling} from "./utils";

export type FindPiecesMovableTo = (to: string, piece: Piece) => PieceData[];

export class StandardNotation {
    private readonly move: string;
    private readonly piece: Piece = Piece.Pawn;
    private readonly from: string = "";
    private readonly to: string = "";
    private readonly promotion?: Piece;
    private static readonly specialMoves = ["0-0", "0-0-0"];
    private static readonly pieces = ["N", "B", "R", "Q", "K"];

    constructor(move: string, findPiecePieceMovableTo?: FindPiecesMovableTo) {
        this.move = StandardNotation.removeSpecialCharacters(move);

        const matches = this.move.match(/([NBRQK])?([a-h][1-8])[x-]?([a-h][1-8])?([NBRQ])?/);

        if(matches){
            this.piece = StandardNotation.toPiece(
                StandardNotation.pieces.includes(this.move.charAt(0)) ? this.move.charAt(0) : "P");
            this.to = matches[3] ? matches[3] : matches[2];
            this.promotion = matches[4] ? StandardNotation.toPiece(matches[4]) : undefined;
            this.from = matches[3] ? matches[2] : this.findFrom(findPiecePieceMovableTo);
        } else if(!StandardNotation.specialMoves.includes(this.move)){
            throw InvalidMoveError.invalid(move);
        }
    }

    toMoveArgs(toMove?: Color): MoveArgs {
        if(this.move === "0-0"){
            return toMove === "white" ? whiteShortCastling : blackShortCastling;
        } else if(this.move === "0-0-0"){
            return toMove === "white" ? whiteLongCastling : blackLongCastling;
        } else if(this.promotion){
            return {
                to: this.to,
                from: this.from,
                options: {
                    promotion: this.promotion
                }
            };
        }

        return {
            to: this.to,
            from: this.from
        };
    }

    private findFrom(findPiecesMovableTo?: FindPiecesMovableTo): string {
        if(!findPiecesMovableTo){
            throw new Error("Missing findPiecesMovableTo function for short notation");
        }

        const pieces: PieceData[] = findPiecesMovableTo(this.to, this.piece)

        if(pieces.length === 1){
            return pieces[0].location;
        } else if(this.move.length === 4 && /[NBRQK][a-h1-8][a-h][1-8]/.test(this.move)){
            const specifiedPieces = pieces.filter(piece => piece.location.includes(this.move.charAt(1)));

            if(specifiedPieces.length === 1){
                return specifiedPieces[0].location;
            }
        } else if(pieces.length > 1){
            throw InvalidMoveError.ambiguous(this.move);
        }

        throw InvalidMoveError.unreachable(this.move);
    }

    private static toPiece(standardNotationPieceName: string): Piece {
        return fenPieceToPositionContent(standardNotationPieceName).split(" ")[1] as Piece;
    }

    private static removeSpecialCharacters(move: string) {
        return move.replace(/[?=+#!]*/g, '');
    }
}

export default StandardNotation;