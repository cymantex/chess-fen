import {Color, ControlledSquares, PieceData, PositionContent, SquareData} from "./types";
import Position from "./Position";
import {positionContentEvent, toPiece} from "./utils";

export class ChessBoard {
    readonly controlledSquares: ControlledSquares;
    readonly map: Map<string, SquareData>;

    private currentPosition: Position;
    private currentColor: Color;
    private opponentColor: Color;
    private readonly board: PositionContent[][];

    constructor(board: PositionContent[][]) {
        this.currentColor = "white";
        this.opponentColor = "black";
        this.currentPosition = new Position(0, 0);
        this.board = board;
        this.map = new Map<string, SquareData>();
        this.controlledSquares = {white: [], black: []};

        this.mapChessBoard();
    }

    public getPiecesMovableTo(coordinate: string) {
        const pieces: PieceData[] = [];

        for(const entry of this.map){
            const piece = entry[1].pieceData;

            if(piece && piece.moves.includes(coordinate)){
                pieces.push(piece);
            }
        }

        return pieces;
    }

    public isControlledSquare(coordinate: string, color?: Color) {
        const controlledBy = this.get(coordinate).controlledBy;

        if(color){
            return controlledBy[color];
        }

        return controlledBy.white || controlledBy.black;
    }

    public get(coordinate: string): SquareData {
        const squareData = this.map.get(coordinate);

        if(!squareData){
            throw new Error(`${coordinate} is not inside this ChessBoard`);
        }

        return squareData;
    }

    public getPiece(coordinate: string): PieceData {
        const pieceData = this.get(coordinate).pieceData;

        if(!pieceData){
            throw new Error(`No piece could be found at ${coordinate}`);
        }

        return pieceData;
    }

    private traversePositions = (onPosition: (positionContent: PositionContent) => any) => {
        this.board.forEach((boardRow, y) => {
            boardRow.forEach((positionContent, x) => {
                this.currentPosition = new Position(x, y);
                this.currentColor = positionContent.startsWith("white") ? "white" : "black";
                this.opponentColor = positionContent.startsWith("white") ? "black" : "white";
                onPosition(positionContent);
            });
        });
    };

    private mapChessBoard() {
        this.traversePositions(positionContent => {
            const currentCoordinate = this.currentPosition.toCoordinate();

            const pieceControlledSquares = positionContentEvent<Position[]>(positionContent, {
                pawn: this.getPawnControlledPositions,
                knight: this.getKnightControlledPositions,
                rook: () => [
                    ...this.getRowControlledPositions(),
                    ...this.getColumnControlledPositions()
                ],
                bishop: this.getDiagonalControlledPositions,
                queen: () => [
                    ...this.getRowControlledPositions(),
                    ...this.getColumnControlledPositions(),
                    ...this.getDiagonalControlledPositions()
                ],
                king: this.getKingControlledPositions,
                empty: () => []
            });

            pieceControlledSquares
                .forEach(position => this.controlledSquares[this.currentColor].push(position.toCoordinate()));

            this.map.set(this.currentPosition.toCoordinate(), {
                controlledBy: {
                    white: false,
                    black: false,
                },
                coordinate: this.currentPosition.toCoordinate(),
                pieceData: positionContent !== "empty" ? {
                    name: toPiece(positionContent),
                    color: this.currentColor,
                    moves: [],
                    controlledSquares: pieceControlledSquares.map(position => position.toCoordinate()),
                    location: currentCoordinate
                } : undefined
            });
        });

        this.controlledSquares.white = ChessBoard.unique(this.controlledSquares.white);
        this.controlledSquares.black = ChessBoard.unique(this.controlledSquares.black);

        this.traversePositions(positionContent => {
            const possibleMoves = positionContentEvent<Position[]>(positionContent, {
                pawn: this.getPawnMoves,
                knight: () => this.getKnightControlledPositions().filter(this.isEmptyOrOccupiedByOpponentPiece),
                rook: () => [
                    ...this.getRowControlledPositions(),
                    ...this.getColumnControlledPositions()
                ].filter(this.isEmptyOrOccupiedByOpponentPiece),
                bishop: () => this.getDiagonalControlledPositions().filter(this.isEmptyOrOccupiedByOpponentPiece),
                queen: () => [
                    ...this.getRowControlledPositions(),
                    ...this.getColumnControlledPositions(),
                    ...this.getDiagonalControlledPositions()
                ].filter(this.isEmptyOrOccupiedByOpponentPiece),
                king: () => this.getKingControlledPositions()
                    .filter(this.isEmptyOrOccupiedByOpponentPiece)
                    .filter(position => !this.controlledSquares[this.opponentColor].includes(position.toCoordinate())),
                empty: () => []
            });

            const currentCoordinate = this.currentPosition.toCoordinate();
            const squareData = this.get(currentCoordinate);

            this.map.set(currentCoordinate, {
                ...squareData,
                controlledBy: {
                    white: this.controlledSquares.white.includes(currentCoordinate),
                    black: this.controlledSquares.black.includes(currentCoordinate)
                },
                pieceData: squareData.pieceData ? {
                    ...squareData.pieceData,
                    inCheck: positionContent === `${this.currentColor} king` &&
                        this.getOpponentControlledSquares().includes(currentCoordinate),
                    moves: possibleMoves.map(position => position.toCoordinate())
                } : undefined
            });
        });
    }

    private getOpponentControlledSquares = () => {
        return this.controlledSquares[this.opponentColor];
    };

    private getRowControlledPositions = (): Position[] => {
        return this.validPositions([
            ...this.getControlledPositionsUntilObstructed(position => position.increaseBy(new Position(-1, 0))),
            ...this.getControlledPositionsUntilObstructed(position => position.increaseBy(new Position(1, 0)))
        ]);
    };

    private getColumnControlledPositions = (): Position[] => {
        return this.validPositions([
            ...this.getControlledPositionsUntilObstructed(position => position.increaseBy(new Position(0, -1))),
            ...this.getControlledPositionsUntilObstructed(position => position.increaseBy(new Position(0, 1)))
        ]);
    };

    private getDiagonalControlledPositions = (): Position[] => {
        return this.validPositions([
            ...this.getControlledPositionsUntilObstructed(position => position.increaseBy(new Position(-1, -1))),
            ...this.getControlledPositionsUntilObstructed(position => position.increaseBy(new Position(-1, 1))),
            ...this.getControlledPositionsUntilObstructed(position => position.increaseBy(new Position(1, -1))),
            ...this.getControlledPositionsUntilObstructed(position => position.increaseBy(new Position(1, 1)))
        ]);
    };

    private getPawnControlledPositions = (): Position[] => {
        if(this.currentColor === "black"){
            return this.validPositions([
                this.currentPosition.increaseBy(new Position(-1, 1)),
                this.currentPosition.increaseBy(new Position(1, 1))
            ]);
        }

        return this.validPositions([
            this.currentPosition.increaseBy(new Position(-1, -1)),
            this.currentPosition.increaseBy(new Position(1, -1))
        ]);
    };

    private getKnightControlledPositions = (): Position[] => {
        return this.validPositions([
            this.currentPosition.increaseBy(new Position(-1, -2)),
            this.currentPosition.increaseBy(new Position(-1, 2)),
            this.currentPosition.increaseBy(new Position(1, -2)),
            this.currentPosition.increaseBy(new Position(1, 2)),
            this.currentPosition.increaseBy(new Position(-2, -1)),
            this.currentPosition.increaseBy(new Position(-2, 1)),
            this.currentPosition.increaseBy(new Position(2, -1)),
            this.currentPosition.increaseBy(new Position(2, 1))
        ]);
    };

    private getKingControlledPositions = (): Position[] => {
        return this.validPositions([
            this.currentPosition.increaseBy(new Position(0, 1)),
            this.currentPosition.increaseBy(new Position(0, -1)),
            this.currentPosition.increaseBy(new Position(1, 0)),
            this.currentPosition.increaseBy(new Position(-1, 0)),
            this.currentPosition.increaseBy(new Position(1, 1)),
            this.currentPosition.increaseBy(new Position(1, -1)),
            this.currentPosition.increaseBy(new Position(-1, 1)),
            this.currentPosition.increaseBy(new Position(-1, -1))
        ]);
    };

    private getPawnMoves = (): Position[] => {
        const coordinate = this.currentPosition.toCoordinate();
        const pawn = this.get(coordinate).pieceData;

        if(!pawn) {
            throw new Error();
        }

        const captures = pawn.controlledSquares.filter(this.hasOpponentPiece).map(Position.fromCoordinate);
        const moves: Position[] = [];

        const addIfNotOccupied = (position: Position) => {
            if (!this.isOccupiedPosition(position)) {
                moves.push(position);
            }
        };

        if(this.currentColor === "white") {
            addIfNotOccupied(this.currentPosition.increaseBy(new Position(0, -1)));

            if (coordinate.endsWith("2")) {
                addIfNotOccupied(this.currentPosition.increaseBy(new Position(0, -2)));
            }
        } else {
            addIfNotOccupied(this.currentPosition.increaseBy(new Position(0, 1)));

            if (coordinate.endsWith("7")) {
                addIfNotOccupied(this.currentPosition.increaseBy(new Position(0, 2)));
            }
        }

        return this.validPositions([
            ...captures,
            ...moves
        ]);
    };

    private isEmptyOrOccupiedByOpponentPiece = (position: Position): boolean => {
        const piece = this.get(position.toCoordinate()).pieceData;

        return piece === undefined || piece.color !== this.currentColor;
    };

    private hasOpponentPiece = (coordinate: string): boolean => {
        const piece = this.get(coordinate).pieceData;

        return !!piece && piece.color !== this.currentColor;
    };

    private isOccupiedPosition = (position: Position): boolean => {
        const content = this.board[position.y] ? this.board[position.y][position.x] : false;
        const opponentColor = this.currentColor === "white" ? "black" : "white";

        if(!content){
            return false;
        } else if(content.toLowerCase().includes(opponentColor)){
            return true;
        } else if(content.toLowerCase().includes(this.currentColor)){
            return true;
        }

        return false;
    };

    private isInsideBoard = (position: Position): boolean => {
        const content = this.board[position.y] ? this.board[position.y][position.x] : false;

        return !!content;
    };

    private getControlledPositionsUntilObstructed = (getNextPosition: (position: Position) => Position) => {
        const controlledPositions = [];
        let currentPosition = getNextPosition(this.currentPosition);

        while(!this.isOccupiedPosition(currentPosition) && this.isInsideBoard(currentPosition)){
            controlledPositions.push(currentPosition);
            currentPosition = getNextPosition(currentPosition);
        }

        if(this.isInsideBoard(currentPosition)){
            controlledPositions.push(currentPosition);
        }

        return controlledPositions;
    };

    private validPositions(array: Position[]): Position[] {
        return array.filter(this.isInsideBoard);
    }

    private static unique(array: string[]): string[] {
        return array.reduce((previous: string[], current: string) => {
            if(previous.includes(current)){
                return previous;
            }

            return [...previous, current];
        }, []);
    };
}

export default ChessBoard;