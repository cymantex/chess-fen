import Position from "./Position";

const traverse = {
    from: (from) => ({
        to: (to) => ({
            searchFor: (predicate) => {
                if(from < to){
                    for(let i = from + 1; i < to; i++){
                        if(predicate(i, from, to)){
                            return true;
                        }
                    }
                } else {
                    for(let i = from - 1; i > to; i--){
                        if(predicate(i)){
                            return true;
                        }
                    }
                }

                return false;
            }
        })
    })
};

const isObstructedDiagonalPath = (fromPosition, toPosition, fen) => {
    return traverse
        .from(fromPosition.y)
        .to(toPosition.y)
        .searchFor((y) => traverse
            .from(fromPosition.x)
            .to(toPosition.x)
            .searchFor((x) =>
                fromPosition.isDiagonalTo(new Position(x, y)) &&
                fen.isOccupiedPlacement({x, y}))
        );
};


const isObstructedVerticalPath = (fromPosition, toPosition, fen) => {
    return traverse
        .from(fromPosition.y)
        .to(toPosition.y)
        .searchFor((y) => fen.isOccupiedPlacement({x: fromPosition.x, y}));
};

const isObstructedHorizontalPath = (fromPosition, toPosition, fen) => {
    return traverse
        .from(fromPosition.x)
        .to(toPosition.x)
        .searchFor((x) => fen.isOccupiedPlacement({x, y: fromPosition.y}));
};

export const isObstructedPath = (fromPosition, toPosition, fen) => {
    if(fromPosition.isDiagonalTo(toPosition)){
        return isObstructedDiagonalPath(fromPosition, toPosition, fen);
    } else if(fromPosition.isVerticalTo(toPosition)){
        return isObstructedVerticalPath(fromPosition, toPosition, fen);
    } else if(fromPosition.isHorizontalTo(toPosition)){
        return isObstructedHorizontalPath(fromPosition, toPosition, fen);
    }

    return false;
};