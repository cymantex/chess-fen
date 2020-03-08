import {InvalidFenError} from "./InvalidFenError";
import {Position} from "./Position";
import {
    CastlingRights,
    Coordinate2D,
    PiecePlacement,
    pieceLongNameToShort,
    PieceShortName,
    pieceShortNameToLong,
    PlayerColor,
    PositionOrCoordinate
} from "./types";

export interface FenCloneArgs {
    piecePlacement?: PiecePlacement[][];
    toMove?: PlayerColor;
    castlingRights?: CastlingRights;
    enPassantSquare?: string;
    halfMoves?: number;
    fullMoves?: number;
}

export interface FenArgs {
    piecePlacement: PiecePlacement[][];
    toMove: PlayerColor;
    castlingRights: CastlingRights;
    enPassantSquare: string;
    halfMoves: number;
    fullMoves: number;
}

export class Fen {
    public static readonly startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    public static readonly emptyPosition = "8/8/8/8/8/8/8/8 w KQkq - 0 1";
    public static readonly emptySquare = "EmptySquare";
    public static readonly outsideBoard = "OutsideBoard";

    readonly fen: string;
    readonly fenTokens: string[];
    readonly rows: number;
    readonly columns: number;
    readonly piecePlacement: PiecePlacement[][];
    readonly toMove: PlayerColor;
    readonly castlingRights: CastlingRights;
    readonly enPassantSquare: string;
    readonly halfMoves: number;
    readonly fullMoves: number;

    constructor(args: string | FenArgs) {
        if(typeof args === "string") {
            this.fen = args;
            this.fenTokens = this.fen.split(" ");
            this.validateFen();
            this.piecePlacement = this.parsePiecePlacement();
            this.toMove = this.parseToMove();
            this.castlingRights = this.parseCastlingRights();
            this.enPassantSquare = this.parseEnPassantSquare();
            this.halfMoves = this.parseHalfMoves();
            this.fullMoves = this.parseFullMoves();
        } else {
            this.piecePlacement = args.piecePlacement;
            this.toMove = args.toMove;
            this.castlingRights = args.castlingRights;
            this.enPassantSquare = args.enPassantSquare;
            this.halfMoves = args.halfMoves;
            this.fullMoves = args.fullMoves;
            this.fen = this.toString();
            this.fenTokens = this.fen.split(" ");
            this.validateFen();
        }

        this.rows = this.piecePlacement.length;
        this.columns = this.piecePlacement[0].length;
    }

    public static from(fenInstance: Fen): Fen {
        return new Fen(fenInstance.toString());
    }

    public cloneWith(args?: FenCloneArgs){
        const fenArgs: FenArgs = {
            piecePlacement: this.piecePlacement,
            toMove: this.toMove,
            castlingRights: this.castlingRights,
            enPassantSquare: this.enPassantSquare,
            halfMoves: this.halfMoves,
            fullMoves: this.fullMoves,
            ...args
        };

        return new Fen(fenArgs);
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

    public isOccupiedCoordinate({x, y}: Coordinate2D): boolean {
        return !this.isEmptyCoordinate({x, y});
    };

    public isEmptyCoordinate({x, y}: Coordinate2D): boolean {
        return this.getPiecePlacement({x, y}) === Fen.emptySquare;
    };

    public getPiecePlacement({x, y}: Coordinate2D): PiecePlacement {
        const column = this.piecePlacement[y];
        const row = column ? column[x] : null;
        return row ? row : Fen.outsideBoard;
    };

    public updatePosition(positionOrCoordinate: PositionOrCoordinate, updatedPlacement: PiecePlacement): Fen {
        const position = Position.fromPositionOrCoordinate(positionOrCoordinate);

        return this.cloneWith({
            piecePlacement: this.piecePlacement
                .map((row, y) => {
                    if(y === position.y){
                        return row.map((placement, x) => (x === position.x) ? updatedPlacement : placement);
                    }

                    return (y === position.y)
                        ? row.map((placement, x) => (x === position.x) ? updatedPlacement : placement)
                        : row;
                })
        });
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

        const mapToPositionX = (placement: PiecePlacement, x: number) => (x === toPosition.x) ? piece : placement;
        const mapFromPositionX = (placement: PiecePlacement, x: number) => (x === fromPosition.x) ? Fen.emptySquare : placement;

        const piecePlacement = this.piecePlacement
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

        if(updateGameData){
            const castlingRights = this.getCastlingRightsAfterMove(fromPosition);
            const enPassantSquare = this.getEnPassantSquare({fromPosition, toPosition});
            const halfMoves = (target === Fen.emptySquare && !piece.includes("Pawn")) ? this.halfMoves + 1 : 0;
            const fullMoves = this.toMove === PlayerColor.Black ? this.fullMoves + 1 : this.fullMoves;
            const toMove = this.toMove === PlayerColor.Black ? PlayerColor.White : PlayerColor.Black;

            return this.cloneWith({castlingRights, enPassantSquare, halfMoves, fullMoves, toMove, piecePlacement});
        }

        return this.cloneWith({piecePlacement});
    };

    private validateFen(): void {
        if(this.fenTokens.length !== 6){
            throw new InvalidFenError(this.fen);
        }
    }

    private parseFenPiecePlacementChar(notation: PieceShortName|string): PiecePlacement|PiecePlacement[] {
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

    private parsePiecePlacement(): PiecePlacement[][] {
        return this
            .fenTokens[0]
            .split("/")
            .map(field => {
                let pieces: PiecePlacement[] = [];

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