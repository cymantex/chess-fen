import {InvalidFenError} from "./InvalidFenError";
import {Position} from "./Position";
import {colors, emptySquare, fenToPiece, outsideBoard, pieces, pieceToFen} from "./FenConstants";

export class Fen {
    static startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    constructor(fen) {
        this.fen = fen;
        this.fenTokens = fen.split(" ");
        this.validateFen();
        this.parse();
    }

    static from(fenInstance){
        return new Fen(fenInstance.toString());
    }

    parse(){
        this.piecePlacement = this.parsePiecePlacement();
        this.toMove = this.parseToMove();
        this.castlingRights = this.parseCastlingRights();
        this.enPassantSquare = this.parseEnPassantSquare();
        this.halfMoves = this.parseHalfMoves();
        this.fullMoves = this.parseFullMoves();
    }

    toString(){
        return [
            this.unparsePiecePlacement(),
            this.unparseToMove(),
            this.unparseCastlingRights(),
            this.unparseEnPassantSquare(),
            this.unparseHalfMoves(),
            this.unparseFullMoves()
        ].join(" ");
    }

    validateFen = () => {
        if(this.fenTokens.length !== 6){
            throw new InvalidFenError(this.fen);
        }
    };

    parseFenPiecePlacementChar = (notation) => {
        if(notation.match(/\d/)){
            return Array(parseInt(notation, 10)).fill(emptySquare);
        } else if(!fenToPiece[notation]){
            throw new InvalidFenError(this.fen);
        }

        return fenToPiece[notation];
    };

    parsePiecePlacement = () => {
        return this
            .fenTokens[0]
            .split("/")
            .map(field => {
                let pieces = [];

                for(let i = 0; i < field.length; i++){
                    const prettifiedFen = this.parseFenPiecePlacementChar(field.charAt(i));

                    if(Array.isArray(prettifiedFen)){
                        pieces.push(...prettifiedFen);
                    } else {
                        pieces.push(prettifiedFen);
                    }
                }

                return pieces;
            });
    };

    unparsePiecePlacement = () => {
        return this
            .piecePlacement
            .map(pieces => {
                const field = [];
                let emptySquares = 0;

                pieces.forEach(piece => {
                    if(piece === emptySquare){
                        emptySquares++;
                    } else {
                        if(emptySquares > 0){
                            field.push(emptySquares);
                            field.push(pieceToFen[piece]);
                            emptySquares = 0;
                        } else {
                            field.push(pieceToFen[piece]);
                        }
                    }
                });

                if(emptySquares > 0){
                    field.push(emptySquares);
                }

                return field.reduce((strings, string) => strings + string);
            })
            .join("/");
    };

    parseToMove = () => {
        return this.fenTokens[1] === "w" ? colors.white : colors.black;
    };

    unparseToMove = () => {
        return this.toMove === colors.white ? "w" : "b";
    };

    parseCastlingRights = () => ({
        white: {
            queenside: this.fenTokens[2].includes("Q"),
            kingside: this.fenTokens[2].includes("K")
        },
        black: {
            queenside: this.fenTokens[2].includes("q"),
            kingside: this.fenTokens[2].includes("k")
        }
    });

    unparseCastlingRights = () => {
        const castlingRights = this.castlingRights;
        let fenCastlingRights = castlingRights.white.kingside ? "K" : "";
        fenCastlingRights += castlingRights.white.queenside ? "Q" : "";
        fenCastlingRights += castlingRights.black.kingside ? "k" : "";
        fenCastlingRights += castlingRights.black.queenside ? "q" : "";
        return fenCastlingRights ? fenCastlingRights : "-";
    };

    parseEnPassantSquare = () => this.fenTokens[3];

    unparseEnPassantSquare = () => this.enPassantSquare;

    parseHalfMoves = () => parseInt(this.fenTokens[4], 10);

    unparseHalfMoves = () => this.halfMoves.toString();

    parseFullMoves = () => parseInt(this.fenTokens[5], 10);

    unparseFullMoves = () => this.fullMoves.toString();

    _getPiecePlacement({x, y}){
        const column = this.piecePlacement[y];
        const row = column ? column[x] : null;
        return row ? row : outsideBoard;
    }

    _getEnPassantSquare = ({fromPosition, toPosition}) => {
        if(!this._getPiecePlacement(fromPosition).includes(pieces.pawn)){
            return "-";
        } else if(fromPosition.y === 6){
            return toPosition.y === 4
                ? new Position(toPosition.x, toPosition.y + 1).toCoordinate()
                : "-";
        } else if(fromPosition.y === 1){
            return toPosition.y === 3
                ? new Position(toPosition.x, toPosition.y - 1).toCoordinate()
                : "-";
        }

        return "-";
    };

    _getCastlingRightsAfterMove = (fromPosition) => {
        const coordinate = fromPosition.toCoordinate();
        const white = this.castlingRights.white;
        const black = this.castlingRights.black;

        return {
            white: {
                kingside: white.kingside && coordinate !== "e1" && coordinate !== "h1",
                queenside: white.queenside && coordinate !== "e1" && coordinate !== "a1"
            },
            black: {
                kingside: black.kingside && coordinate !== "e8" && coordinate !== "h8",
                queenside: black.queenside && coordinate !== "e8" && coordinate !== "a8"
            }
        }
    };

    makeMove(fromPositionOrCoordinate, toPositionOrCoordinate){
        const fromPosition = Position.fromPositionOrCoordinate(fromPositionOrCoordinate);
        const toPosition = Position.fromPositionOrCoordinate(toPositionOrCoordinate);
        const piece = this._getPiecePlacement(fromPosition);
        const target = this._getPiecePlacement(toPosition);

        if(
            target === outsideBoard ||
            piece === emptySquare ||
            fromPosition.isEqualTo(toPosition) ||
            !piece.includes(this.toMove)
        ){
            return this;
        }

        const mapToPositionX = (placement, x) => (x === toPosition.x) ? piece : placement;
        const mapFromPositionX = (placement, x) => (x === fromPosition.x) ? emptySquare : placement;

        this.castlingRights = this._getCastlingRightsAfterMove(fromPosition);
        this.enPassantSquare = this._getEnPassantSquare({fromPosition, toPosition});
        this.toMove = piece.startsWith(colors.black) ? colors.white : colors.black;
        this.halfMoves = (target === emptySquare && !piece.includes(pieces.pawn))
            ? this.halfMoves + 1
            : 0;
        this.fullMoves = piece.startsWith(colors.black)
            ? this.fullMoves + 1
            : this.fullMoves;
        this.piecePlacement = this.piecePlacement
            .map((row, y) => {
                if(y === fromPosition.y && y === toPosition.y){
                    return row
                        .map(mapFromPositionX)
                        .map(mapToPositionX);
                } else if(y === fromPosition.y){
                    return row.map(mapFromPositionX);
                } else if(y === toPosition.y){
                    return row.map(mapToPositionX);
                }

                return row;
            });

        return this;
    }
}