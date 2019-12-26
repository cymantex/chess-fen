import {InvalidFenError} from "./InvalidFenError";
import {Position} from "./Position";
import {
    CastlingRights,
    Coordinate2D,
    pieceLongNameToShort,
    PieceShortName,
    pieceShortNameToLong,
    PlayerColor
} from "./types";

export type PositionOrCoordinate = string | Position;

export class Fen {
    public static readonly startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    public static readonly emptyPosition = "8/8/8/8/8/8/8/8 w KQkq - 0 1";
    public static readonly emptySquare = "EmptySquare";
    public static readonly outsideBoard = "OutsideBoard";

    readonly fen: string;
    readonly fenTokens: string[];
    readonly rows: number;
    readonly columns: number;
    piecePlacement: string[][];
    toMove: PlayerColor;
    castlingRights: CastlingRights;
    enPassantSquare: string;
    halfMoves: number;
    fullMoves: number;

    constructor(fen: string) {
        this.fen = fen;
        this.fenTokens = fen.split(" ");
        this.validateFen();
        this.piecePlacement = this.parsePiecePlacement();
        this.toMove = this.parseToMove();
        this.castlingRights = this.parseCastlingRights();
        this.enPassantSquare = this.parseEnPassantSquare();
        this.halfMoves = this.parseHalfMoves();
        this.fullMoves = this.parseFullMoves();
        this.rows = this.piecePlacement.length;
        this.columns = this.piecePlacement[0].length;
    }

    public static from(fenInstance: Fen): Fen {
        return new Fen(fenInstance.toString());
    }

    public toString(): string {
        return [
            this.unparsePiecePlacement(),
            this.unparseToMove(),
            this.unparseCastlingRights(),
            this.unparseEnPassantSquare(),
            this.unparseHalfMoves(),
            this.unparseFullMoves()
        ].join(" ");
    };

    public isOccupiedPlacement({x, y}: Coordinate2D): boolean {
        return !this.isEmptyPlacement({x, y});
    };

    public isEmptyPlacement({x, y}: Coordinate2D): boolean {
        return this.getPiecePlacement({x, y}) === Fen.emptySquare;
    };

    public getPiecePlacement({x, y}: Coordinate2D): string {
        const column = this.piecePlacement[y];
        const row = column ? column[x] : null;
        return row ? row : Fen.outsideBoard;
    };

    public updatePosition(positionOrCoordinate: PositionOrCoordinate, updatedPlacement: string): Fen {
        const position = Position.fromPositionOrCoordinate(positionOrCoordinate);

        this.piecePlacement = this.piecePlacement
            .map((row, y) => {
                if(y === position.y){
                    return row.map((placement, x) => (x === position.x) ? updatedPlacement : placement);
                }

                return (y === position.y)
                    ? row.map((placement, x) => (x === position.x) ? updatedPlacement : placement)
                    : row;
            });

        return this;
    };

    public clearPosition(positionOrCoordinate: string | Position): Fen {
        return this.updatePosition(positionOrCoordinate, Fen.emptySquare);
    };

    public makeMove(fromPositionOrCoordinate: PositionOrCoordinate, toPositionOrCoordinate: PositionOrCoordinate,
                    updateGameData: boolean = true): Fen {
        const fromPosition = Position.fromPositionOrCoordinate(fromPositionOrCoordinate);
        const toPosition = Position.fromPositionOrCoordinate(toPositionOrCoordinate);
        const piece = this.getPiecePlacement(fromPosition);
        const target = this.getPiecePlacement(toPosition);

        const mapToPositionX = (placement: string, x: number) => (x === toPosition.x) ? piece : placement;
        const mapFromPositionX = (placement: string, x: number) => (x === fromPosition.x) ? Fen.emptySquare : placement;

        if(updateGameData){
            this.castlingRights = this.getCastlingRightsAfterMove(fromPosition);
            this.enPassantSquare = this.getEnPassantSquare({fromPosition, toPosition});
            this.toMove = piece.startsWith("Black") ? PlayerColor.White : PlayerColor.Black;
            this.halfMoves = (target === Fen.emptySquare && !piece.includes("Pawn")) ? this.halfMoves + 1 : 0;
            this.fullMoves = piece.startsWith("Black") ? this.fullMoves + 1 : this.fullMoves;
        }

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
    };

    private validateFen(): void {
        if(this.fenTokens.length !== 6){
            throw new InvalidFenError(this.fen);
        }
    }

    private parseFenPiecePlacementChar(notation: PieceShortName|string): string|string[] {
        if(notation.match(/\d/)){
            return Array(parseInt(notation, 10)).fill(Fen.emptySquare);
        }

        try {
            if(notation in PieceShortName){
                return pieceShortNameToLong(notation);
            }
        } catch {}

        throw new InvalidFenError(this.fen);
    }

    private parsePiecePlacement(): string[][] {
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
    }

    private unparsePiecePlacement(): string {
        return this
            .piecePlacement
            .map(pieces => {
                const field = [];
                let emptySquares = 0;

                pieces.forEach(piece => {
                    if(piece === Fen.emptySquare){
                        emptySquares++;
                    } else {
                        if(emptySquares > 0){
                            field.push(emptySquares);
                            field.push(pieceLongNameToShort(piece));
                            emptySquares = 0;
                        } else {
                            field.push(pieceLongNameToShort(piece));
                        }
                    }
                });

                if(emptySquares > 0){
                    field.push(emptySquares);
                }

                return field.reduce((strings, string) => strings + string);
            })
            .join("/");
    }

    private parseToMove(): PlayerColor {
        return this.fenTokens[1] === "w" ? PlayerColor.White : PlayerColor.Black;
    }

    private unparseToMove(): string {
        return this.toMove === PlayerColor.White ? "w" : "b";
    }

    private parseCastlingRights(): CastlingRights {
        return {
            white: {
                queenside: this.fenTokens[2].includes("Q"),
                kingside: this.fenTokens[2].includes("K")
            },
            black: {
                queenside: this.fenTokens[2].includes("q"),
                kingside: this.fenTokens[2].includes("k")
            }
        };
    };

    private unparseCastlingRights(): string {
        const castlingRights = this.castlingRights;
        let fenCastlingRights = castlingRights.white.kingside ? "K" : "";
        fenCastlingRights += castlingRights.white.queenside ? "Q" : "";
        fenCastlingRights += castlingRights.black.kingside ? "k" : "";
        fenCastlingRights += castlingRights.black.queenside ? "q" : "";
        return fenCastlingRights ? fenCastlingRights : "-";
    }

    private parseEnPassantSquare(): string {
        return this.fenTokens[3];
    }

    private unparseEnPassantSquare(): string {
        return this.enPassantSquare;
    }

    private parseHalfMoves(): number {
        return parseInt(this.fenTokens[4], 10);
    }

    private unparseHalfMoves(): string {
        return this.halfMoves.toString();
    }

    private parseFullMoves(): number {
        return parseInt(this.fenTokens[5], 10);
    }

    private unparseFullMoves(): string {
        return this.fullMoves.toString();
    }

    private getEnPassantSquare({fromPosition, toPosition}: {fromPosition: Position, toPosition: Position}): string {
        if(!this.getPiecePlacement(fromPosition).includes("Pawn")){
            return "-";
        } else if(fromPosition.y === this.rows - 2){
            return toPosition.y === this.rows - 4
                ? new Position(toPosition.x, toPosition.y + 1).toCoordinate()
                : "-";
        } else if(fromPosition.y === 1){
            return toPosition.y === 3
                ? new Position(toPosition.x, toPosition.y - 1).toCoordinate()
                : "-";
        }

        return "-";
    };

    private getCastlingRightsAfterMove(fromPosition: Position): CastlingRights {
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
    }
}

export default Fen;