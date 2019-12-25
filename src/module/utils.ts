import {Position} from "./Position";
import {Fen} from "./Fen";

const traverse = {
    from: (from: number) => ({
        to: (to: number) => ({
            searchFor: (predicate: ((i: number, from?: number, to?: number) => boolean)|((i: number) => boolean)) => {
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

const isObstructedDiagonalPath = (fromPosition: Position, toPosition: Position, fen: Fen) => {
    return traverse
        .from(fromPosition.y)
        .to(toPosition.y)
        .searchFor((y: number) => traverse
            .from(fromPosition.x)
            .to(toPosition.x)
            .searchFor((x: number) =>
                fromPosition.isDiagonalTo(new Position(x, y)) &&
                fen.isOccupiedPlacement({x, y}))
        );
};


const isObstructedVerticalPath = (fromPosition: Position, toPosition: Position, fen: Fen) => {
    return traverse
        .from(fromPosition.y)
        .to(toPosition.y)
        .searchFor((y: number) => fen.isOccupiedPlacement({x: fromPosition.x, y}));
};

const isObstructedHorizontalPath = (fromPosition: Position, toPosition: Position, fen: Fen) => {
    return traverse
        .from(fromPosition.x)
        .to(toPosition.x)
        .searchFor((x: number) => fen.isOccupiedPlacement({x, y: fromPosition.y}));
};

export const isObstructedPath = (fromPosition: Position, toPosition: Position, fen: Fen) => {
    if(fromPosition.isDiagonalTo(toPosition)){
        return isObstructedDiagonalPath(fromPosition, toPosition, fen);
    } else if(fromPosition.isVerticalTo(toPosition)){
        return isObstructedVerticalPath(fromPosition, toPosition, fen);
    } else if(fromPosition.isHorizontalTo(toPosition)){
        return isObstructedHorizontalPath(fromPosition, toPosition, fen);
    }

    return false;
};