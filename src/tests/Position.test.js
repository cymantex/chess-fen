import {Position} from "../module/Position";
import _ from "lodash";

const coordinates = {
    x: ["a", "b", "c", "d", "e", "f", "g", "h"],
    y: [8, 7, 6, 5, 4, 3, 2, 1]
};
let board = {};

beforeEach(() => {
    board = _.flatMap(
        coordinates.x.map((x) => coordinates.y.map((y) => ({
            [x + y]: Position.fromCoordinate(x + y)
        })))
    ).reduce((objects, object) => ({...objects, ...object}));
});


it("Creates position from object", () => {
    expect(Position.from({x: 4, y: 1}).isEqualTo(board.e7)).toBeTruthy();
});

it("Properly converts coordinate to position", () => {
    expect(Position.fromCoordinate("a8").isEqualTo(board.a8)).toBeTruthy();
    expect(Position.fromCoordinate("e7").isEqualTo(board.e7)).toBeTruthy();
    expect(Position.fromCoordinate("e2").isEqualTo(board.e2)).toBeTruthy();
    expect(Position.fromCoordinate("h1").isEqualTo(board.h1)).toBeTruthy();
});

it("Converts position to coordinate", () => {
    expect(board.a8.toCoordinate()).toBe("a8");
    expect(board.e7.toCoordinate()).toBe("e7");
    expect(board.e2.toCoordinate()).toBe("e2");
    expect(board.h1.toCoordinate()).toBe("h1");
});

it("Increases position", () => {
    expect(board.e7.increaseBy(new Position(2, 2)).toCoordinate()).toBe("g5")
});

it("Detects if position is in direction", () => {
    expect(board.h1.isWestTo(board.a1)).toBeTruthy();
    expect(board.a1.isWestTo(board.h1)).toBeFalsy();
    expect(board.h1.isWestTo(board.f1, 2)).toBeTruthy();
    expect(board.h1.isWestTo(board.f1, 3)).toBeFalsy();

    expect(board.h1.isNorthTo(board.h8)).toBeTruthy();
    expect(board.h8.isNorthTo(board.h1)).toBeFalsy();
    expect(board.h1.isNorthTo(board.h3, 2)).toBeTruthy();
    expect(board.h1.isNorthTo(board.h3, 3)).toBeFalsy();

    expect(board.a1.isEastTo(board.h1)).toBeTruthy();
    expect(board.h1.isEastTo(board.a1)).toBeFalsy();
    expect(board.a1.isEastTo(board.c1, 2)).toBeTruthy();
    expect(board.a1.isEastTo(board.c1, 3)).toBeFalsy();

    expect(board.h8.isSouthTo(board.h1)).toBeTruthy();
    expect(board.h1.isSouthTo(board.h8)).toBeFalsy();
    expect(board.h8.isSouthTo(board.h6, 2)).toBeTruthy();
    expect(board.h8.isSouthTo(board.h6, 3)).toBeFalsy();
});

it("Detects if diagonal to another position or not", () => {
    expect(board.a8.isDiagonalTo(board.h1)).toBeTruthy();
    expect(board.h1.isDiagonalTo(board.a8)).toBeTruthy();
    expect(board.a8.isDiagonalTo(board.e2)).toBeFalsy();
    expect(board.a8.isDiagonalTo(board.h1, 7)).toBeTruthy();
    expect(board.a8.isDiagonalTo(board.h1, 6)).toBeFalsy();
});

it("Detects if horizontal to another position or not", () => {
    expect(board.a1.isHorizontalTo(board.h1)).toBeTruthy();
    expect(board.h1.isHorizontalTo(board.a1)).toBeTruthy();
    expect(board.a1.isHorizontalTo(board.a8)).toBeFalsy();

    expect(board.a1.isHorizontalTo(board.h1, 7)).toBeTruthy();
    expect(board.a1.isHorizontalTo(board.h1, 6)).toBeFalsy();
});

it("Detects if adjacent to another position or not", () => {
    expect(board.e2.isAdjacentTo(board.d3)).toBeTruthy();
    expect(board.e2.isAdjacentTo(board.d2)).toBeTruthy();
    expect(board.e2.isAdjacentTo(board.d1)).toBeTruthy();
    expect(board.e2.isAdjacentTo(board.e3)).toBeTruthy();
    expect(board.e2.isAdjacentTo(board.e1)).toBeTruthy();
    expect(board.e2.isAdjacentTo(board.f3)).toBeTruthy();
    expect(board.e2.isAdjacentTo(board.f2)).toBeTruthy();
    expect(board.e2.isAdjacentTo(board.f1)).toBeTruthy();

    expect(board.e2.isAdjacentTo(board.e2)).toBeFalsy();
    expect(board.e2.isAdjacentTo(board.g2)).toBeFalsy();

    expect(board.e2.isAdjacentTo(board.g3, 2)).toBeTruthy();
    expect(board.e2.isAdjacentTo(board.h2, 2)).toBeFalsy();
});

it("Detects if vertical to another position or not", () => {
    expect(board.e2.isVerticalTo(board.e7)).toBeTruthy();
    expect(board.e7.isVerticalTo(board.e2)).toBeTruthy();
    expect(board.e2.isVerticalTo(board.a1)).toBeFalsy();

    expect(board.a1.isVerticalTo(board.a8, 7)).toBeTruthy();
    expect(board.a1.isVerticalTo(board.a8, 6)).toBeFalsy();
});

it("Detects if knight move or not", () => {
    expect(board.e3.isKnightMoveTo(board.d1)).toBeTruthy();
    expect(board.e3.isKnightMoveTo(board.f1)).toBeTruthy();
    expect(board.e3.isKnightMoveTo(board.c2)).toBeTruthy();
    expect(board.e3.isKnightMoveTo(board.g2)).toBeTruthy();
    expect(board.e3.isKnightMoveTo(board.c4)).toBeTruthy();
    expect(board.e3.isKnightMoveTo(board.g4)).toBeTruthy();
    expect(board.e3.isKnightMoveTo(board.d5)).toBeTruthy();
    expect(board.e3.isKnightMoveTo(board.f5)).toBeTruthy();

    expect(board.e3.isKnightMoveTo(board.e3)).toBeFalsy();
    expect(board.e3.isKnightMoveTo(board.c5)).toBeFalsy();
    expect(board.e3.isKnightMoveTo(board.e4)).toBeFalsy();
    expect(board.e3.isKnightMoveTo(board.c3)).toBeFalsy();
    expect(board.e3.isKnightMoveTo(board.b4)).toBeFalsy();
});

it("Adjusts position to tileSize", () => {
    expect(new Position(100, 100).toGridPosition(100).toCoordinate()).toBe("b7")
});

it("Creates position from coordinate and object", () => {
    expect(Position.fromPositionOrCoordinate("a8").isEqualTo(board.a8)).toBeTruthy();
    expect(Position.fromPositionOrCoordinate({x: 4, y: 1}).isEqualTo(board.e7)).toBeTruthy();
});