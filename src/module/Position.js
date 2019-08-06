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

    rotate = (rotate = true) => {
        return rotate ? new Position(-this.x, -this.y) : this;
    };

    toString = () => {
        return this.toCoordinate();
    };

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

    isKnightMoveTo = (position) => {
        return !this.isDiagonalTo(position) &&
            !this.isVerticalTo(position) &&
            !this.isHorizontalTo(position) &&
            this.isWithinRange(position, 2);
    };

    isWithinRange = (position, range = 1) => {
        const deltaY = Math.abs(position.y - this.y);
        const deltaX = Math.abs(position.x - this.x);
        return deltaX <= range && deltaY <= range;
    };

    isAdjacentTo = (position, range = 1) => {
        for(let x = 0; x < Position.columns; x++){
            for(let y = 0; y < Position.columns; y++){
                const thePosition = new Position(x, y);
                const xIsInRange = x <= this.x + range && x >= this.x - range;
                const yIsInRange = y <= this.y + range && y >= this.y - range;

                if(
                    xIsInRange &&
                    yIsInRange &&
                    thePosition.isEqualTo(position) &&
                    !thePosition.isEqualTo(this)
                ){
                    return true;
                }
            }
        }

        return false;
    };

    isDiagonalTo = (position, maxSpaces = Infinity) => {
        const deltaY = Math.abs(position.y - this.y);
        const deltaX = Math.abs(position.x - this.x);
        return deltaY === deltaX && deltaX <= maxSpaces;
    };

    isVerticalTo = (position, maxSpaces = Infinity) => {
        const deltaY = Math.abs(position.y - this.y);
        return this.x === position.x && deltaY <= maxSpaces;
    };

    isHorizontalTo = (position, maxSpaces = Infinity) => {
        const deltaX = Math.abs(position.x - this.x);
        return this.y === position.y && deltaX <= maxSpaces;
    };

    isEqualTo = (position) => {
        return this.x === position.x && this.y === position.y;
    };

    isNorthTo = (position) => {
        return this.y > position.y;
    };

    isSouthTo = (position) => {
        return this.y < position.y;
    };

    isWestTo = (position) => {
        return this.x > position.x;
    };

    isEastTo = (position) => {
        return this.x < position.x;
    };
}

export default Position;