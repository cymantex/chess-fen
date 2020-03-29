import {InvalidFenError} from "./InvalidFenError";
import {Position} from "./Position";
import {CastlingRights, Color, FenPiece, MoveArgs, Piece, PositionContent, PositionOrCoordinate} from "./types";
import {
    isCastlingAvailability,
    isEnPassantSquare,
    isPositiveInteger, toColoredPiece,
    coloredPieceToFenPiece,
    fenPieceToColoredPiece
} from "./utils";
import {StandardNotation} from "./StandardNotation";
import {ChessBoard} from "./ChessBoard";

export interface FenArgs {
    board: PositionContent[][];
    toMove: Color;
    castlingRights: CastlingRights;
    enPassantSquare: string;
    halfMoves: number;
    fullMoves: number;
}

export class Fen {
    public static readonly startingPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    public static readonly emptyPosition = "8/8/8/8/8/8/8/8 w KQkq - 0 1";
    public static readonly emptySquare = "empty";

    readonly fen: string;
    readonly rows: number;
    readonly columns: number;
    readonly board: PositionContent[][];
    readonly toMove: Color;
    readonly castlingRights: CastlingRights;
    readonly enPassantSquare: string;
    readonly halfMoves: number;
    readonly fullMoves: number;

    private readonly fenTokens: string[];

    constructor(args?: string | FenArgs) {
        let customArgs = !args ? Fen.startingPosition : args;

        if(typeof customArgs === "string"){
            this.fen = customArgs;
            this.fenTokens = this.fen.split(" ");
            this.validate();
            this.board = this.parseBoard();
            this.toMove = this.parseToMove();
            this.castlingRights = this.parseCastlingRights();
            this.enPassantSquare = this.parseEnPassantSquare();
            this.halfMoves = this.parseHalfMoves();
            this.fullMoves = this.parseFullMoves();
        } else {
            this.board = customArgs.board;
            this.toMove = customArgs.toMove;
            this.castlingRights = customArgs.castlingRights;
            this.enPassantSquare = customArgs.enPassantSquare;
            this.halfMoves = customArgs.halfMoves;
            this.fullMoves = customArgs.fullMoves;
            this.fen = this.toString();
            this.fenTokens = this.fen.split(" ");
            this.validate();
        }

        this.rows = this.board.length;
        this.columns = this.board[0].length;
    }

    public static from(fenInstance: Fen): Fen {
        return new Fen(fenInstance.toString());
    }

    public cloneWith(args?: Partial<FenArgs>) {
        const fenArgs: FenArgs = {
            board: this.board,
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
            this.unparseBoard(),
            this.unparseToMove(),
            this.unparseCastlingRights(),
            this.unparseEnPassantSquare(),
            this.unparseHalfMoves(),
            this.unparseFullMoves()
        ].join(" ");
    };

    public isOccupied(positionOrCoordinate: PositionOrCoordinate): boolean {
        return !this.isEmpty(positionOrCoordinate);
    };

    public isEmpty(positionOrCoordinate: PositionOrCoordinate): boolean {
        const positionContent = this.get(positionOrCoordinate);
        return positionContent === null || positionContent === Fen.emptySquare;
    };

    public get(positionOrCoordinate: Position | string): PositionContent | null {
        const position = Position.fromPositionOrCoordinate(positionOrCoordinate);
        const column = this.board[position.y];
        return column ? column[position.x] : null;
    };

    public update(positionOrCoordinate: PositionOrCoordinate, updatedPlacement: PositionContent): Fen {
        const position = Position.fromPositionOrCoordinate(positionOrCoordinate);

        return this.cloneWith({
            board: this.board
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

    public clear(positionOrCoordinate: string | Position): Fen {
        return this.update(positionOrCoordinate, Fen.emptySquare);
    };

    public move(args: MoveArgs | string): Fen {
        const defaultOptions = {updateGameData: true, specialMoves: [], promotion: false};
        let customArgs: MoveArgs = typeof args === "string"
            ? new StandardNotation(args, this.findPieceMovableTo).toMoveArgs(this.toMove)
            : args;
        const {from, to, options} = typeof args === "string"
            ? {...customArgs, options: {...defaultOptions, ...customArgs.options}}
            : {...args, options: {...defaultOptions, ...args.options}};
        const {updateGameData, specialMoves, promotion} = options;

        const fromPosition = Position.fromPositionOrCoordinate(from);
        const toPosition = Position.fromPositionOrCoordinate(to);
        const fromContent = this.get(fromPosition);
        const toContent = this.get(toPosition);

        if(fromContent === null){
            throw new Error("Could not find " + from);
        } else if(toContent === null) {
            throw new Error("Could not find " + to);
        }

        const mapToPositionX = (placement: PositionContent, x: number) => (x === toPosition.x) ? fromContent : placement;
        const mapFromPositionX = (placement: PositionContent, x: number) => (x === fromPosition.x) ? Fen.emptySquare : placement;

        const board = this.board
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

        let newFen = null;

        if(updateGameData){
            const castlingRights = this.getCastlingRightsAfterMove(fromPosition);
            const enPassantSquare = this.getEnPassantSquare({fromPosition, toPosition});
            const halfMoves = (toContent === Fen.emptySquare && !fromContent.includes("pawn")) ? this.halfMoves + 1 : 0;
            const fullMoves = this.toMove === "black" ? this.fullMoves + 1 : this.fullMoves;
            const toMove = this.toMove === "black" ? "white" : "black";

            newFen = this.cloneWith({castlingRights, enPassantSquare, halfMoves, fullMoves, toMove, board});
        } else {
            newFen = this.cloneWith({board});
        }

        if(promotion){
            newFen = newFen.update(toPosition, toColoredPiece(this.toMove, promotion as Piece));
        }

        if(specialMoves.length > 0){
            const [head, ...tail] = specialMoves;
            return newFen.move({
                ...head, options: {
                    updateGameData: false,
                    specialMoves: tail
                }
            });
        }

        return newFen;
    };

    private validate(): void {
        if(this.fenTokens.length !== 6){
            throw InvalidFenError.invalidNumberOfFields();
        } else if(!/^([wb])$/.test(this.fenTokens[1])){
            throw InvalidFenError.invalidToMove();
        } else if(!isCastlingAvailability(this.fenTokens[2])){
            throw InvalidFenError.invalidCastlingAvailability();
        } else if(!isEnPassantSquare(this.fenTokens[3])){
            throw InvalidFenError.invalidEnPassantSquare();
        } else if(!isPositiveInteger(this.fenTokens[4])){
            throw InvalidFenError.invalidHalfMoveNumber();
        } else if(!isPositiveInteger(this.fenTokens[5])){
            throw InvalidFenError.invalidMoveNumber();
        }
    }

    private findPieceMovableTo = (to: string, pieceName: Piece) => {
        return new ChessBoard(this.board)
            .getPiecesMovableTo(to)
            .filter(piece => piece.color === this.toMove)
            .filter(piece => piece.name === pieceName);
    };

    private parseBoardChar(notation: FenPiece | string): PositionContent | PositionContent[] {
        if(notation.match(/\d/)){
            return Array(parseInt(notation, 10)).fill(Fen.emptySquare);
        }

        try {
            if(notation in FenPiece){
                return fenPieceToColoredPiece(notation);
            }
        } catch{}

        throw new InvalidFenError(this.fen);
    }

    private parseBoard(): PositionContent[][] {
        return this
            .fenTokens[0]
            .split("/")
            .map(field => {
                let piecePlacements: PositionContent[] = [];

                for(let i = 0; i < field.length; i++){
                    const prettifiedFen = this.parseBoardChar(field.charAt(i));

                    if(Array.isArray(prettifiedFen)){
                        piecePlacements.push(...prettifiedFen);
                    } else {
                        piecePlacements.push(prettifiedFen);
                    }
                }

                return piecePlacements;
            });
    }

    private unparseBoard(): string {
        return this
            .board
            .map(pieces => {
                const field = [];
                let emptySquares = 0;

                pieces.forEach(piece => {
                    if(piece === Fen.emptySquare){
                        emptySquares++;
                    } else {
                        if(emptySquares > 0){
                            field.push(emptySquares);
                            field.push(coloredPieceToFenPiece(piece));
                            emptySquares = 0;
                        } else {
                            field.push(coloredPieceToFenPiece(piece));
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

    private parseToMove(): Color {
        return this.fenTokens[1] === "w" ? "white" : "black";
    }

    private unparseToMove(): string {
        return this.toMove === "white" ? "w" : "b";
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
    }

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
        const positionContent = this.get(fromPosition);

        if(positionContent === null || !positionContent.includes("pawn")){
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
    }

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