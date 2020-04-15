import {Coordinate2D} from "./types";

const defaultNumberOfRows = 8;

export class Position {
    readonly x: number;
    readonly y: number;
    readonly rows: number;

    constructor(x: number, y: number, rows = defaultNumberOfRows) {
        this.x = x;
        this.y = y;
        this.rows = rows;
    }

    public static from({x, y}: Coordinate2D, rows = defaultNumberOfRows) {
        return new Position(x, y, rows);
    }

    public static fromCoordinate(coordinate: string, rows = defaultNumberOfRows): Position {
        const row = parseInt(coordinate.substring(1, coordinate.length), 10);

        return new Position(
            coordinate.charAt(0).charCodeAt(0) - 97,
            (row > rows) ? row : Math.abs(row - rows),
            rows
        )
    }

    public static fromPositionOrCoordinate(positionOrCoordinate: Coordinate2D | string, rows = defaultNumberOfRows) {
        return typeof positionOrCoordinate === "string"
            ? Position.fromCoordinate(positionOrCoordinate, rows)
            : Position.from({x: positionOrCoordinate.x, y: positionOrCoordinate.y}, rows);
    }

    public rotate(rotate = true): Position {
        if (!rotate){
            return this;
        }

        const rotatedX = Math.abs(this.x - (this.rows - 1));
        const rotatedY = Math.abs(this.y - (this.rows - 1));
        return new Position(rotatedX, rotatedY);
    };

    public toCoordinate(): string {
        return String.fromCharCode(this.x + 97) + Math.abs(this.y - this.rows);
    };

    public toGridPosition(tileSize: number): Position {
        const x = Math.round(this.x / tileSize);
        const y = Math.round(this.y / tileSize);
        return new Position(x, y);
    };

    public increaseBy(position: Position): Position {
        const x = this.x + position.x;
        const y = this.y + position.y;
        return new Position(x, y);
    };

    public isKnightMoveTo(position: Position): boolean {
        return !this.isDiagonalTo(position) &&
            !this.isVerticalTo(position) &&
            !this.isHorizontalTo(position) &&
            this.isWithinRange(position, 2);
    };

    public isWithinRange(position: Position, range: number = 1): boolean {
        const deltaY = Math.abs(position.y - this.y);
        const deltaX = Math.abs(position.x - this.x);
        return deltaX <= range && deltaY <= range;
    };

    public isAdjacentTo(position: Position, range: number = 1): boolean {
        for(let x = 0; x < this.rows; x++){
            for(let y = 0; y < this.rows; y++){
                const thePosition = new Position(x, y);
                const xIsInRange = x <= this.x + range && x >= this.x - range;
                const yIsInRange = y <= this.y + range && y >= this.y - range;

                if(xIsInRange && yIsInRange && thePosition.equals(position) && !thePosition.equals(this)){
                    return true;
                }
            }
        }

        return false;
    };

    public isDiagonalTo(position: Position, maxSpaces: number = Infinity): boolean {
        const deltaY = Math.abs(position.y - this.y);
        const deltaX = Math.abs(position.x - this.x);
        return deltaY === deltaX && deltaX <= maxSpaces;
    };

    public isVerticalTo(position: Position, maxSpaces = Infinity): boolean {
        const deltaY = Math.abs(position.y - this.y);
        return this.x === position.x && deltaY <= maxSpaces;
    };

    public isHorizontalTo(position: Position, maxSpaces = Infinity): boolean {
        const deltaX = Math.abs(position.x - this.x);
        return this.y === position.y && deltaX <= maxSpaces;
    };

    public isNorthTo(position: Position, range: number = 0): boolean {
        if(range){
            return this.y === position.y + range;
        }

        return this.y > position.y;
    };

    public isSouthTo(position: Position, range: number = 0): boolean {
        if(range){
            return this.y === position.y - range;
        }

        return this.y < position.y;
    };

    public isWestTo(position: Position, range: number = 0): boolean {
        if(range){
            return this.x === position.x + range;
        }

        return this.x > position.x;
    };

    public isEastTo(position: Position, range: number = 0): boolean {
        if(range){
            return this.x === position.x - range;
        }

        return this.x < position.x;
    };

    public toString(): string {
        return this.toCoordinate();
    };

    public equals(position: Position): boolean {
        return this.x === position.x && this.y === position.y;
    };
}

export default Position;