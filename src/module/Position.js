export class Position {
    static columns = 8;

    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    static from({x, y}){
        return new Position(x, y);
    }

    static fromCoordinate(coordinate){
        const row = parseInt(coordinate.substring(1, coordinate.length), 10);

        return new Position(
            coordinate.charAt(0).charCodeAt(0) - 97,
            (row > Position.columns) ? row : Math.abs(row - Position.columns)
        )
    }

    static fromPositionOrCoordinate(positionOrCoordinate){
        return typeof positionOrCoordinate === "string"
            ? Position.fromCoordinate(positionOrCoordinate)
            : Position.from(positionOrCoordinate);
    }

    toCoordinate = () => {
        return String.fromCharCode(this.x + 97) + Math.abs(this.y - Position.columns);
    };

    toGridPosition = (tileSize) => {
        this.x = Math.round(this.x / tileSize);
        this.y = Math.round(this.y / tileSize);
        return this;
    };

    increaseBy = (position) => {
        this.x = this.x + position.x;
        this.y = this.y + position.y;
        return this;
    };

    isDiagonalTo = (position) => {
        const deltaY = Math.abs(position.y - this.y);
        const deltaX = Math.abs(position.x - this.x);
        return deltaY === deltaX;
    };

    isVerticalTo = (position) => {
        return this.x === position.x;
    };

    isHorizontalTo = (position) => {
        return this.y === position.y;
    };

    isEqualTo = (position) => {
        return this.x === position.x && this.y === position.y;
    };
}