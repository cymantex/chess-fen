import {Position} from "../module/Position";

const getPosition = (coordinate: string): Position => {
    return Position.fromCoordinate(coordinate);
};

describe("Position tests", () => {
    it("Creates position from object", () => {
        expect(Position.from({x: 4, y: 1}).equals(getPosition("e7"))).toBeTruthy();
    });

    it("Properly converts coordinate to position", () => {
        expect(Position.fromCoordinate("a8").equals(new Position(0, 0))).toBeTruthy();
        expect(Position.fromCoordinate("e7").equals(new Position(4, 1))).toBeTruthy();
        expect(Position.fromCoordinate("h1").equals(new Position(7, 7))).toBeTruthy();
    });

    it("Converts position to coordinate", () => {
        expect(getPosition("a8").toCoordinate()).toBe("a8");
        expect(getPosition("a7").toCoordinate()).toBe("a7");
        expect(getPosition("a2").toCoordinate()).toBe("a2");
        expect(getPosition("h1").toCoordinate()).toBe("h1");
    });

    it("Increases position", () => {
        expect(getPosition("e7").increaseBy(new Position(2, 2)).toCoordinate()).toBe("g5")
    });

    it("Detects if position is in direction", () => {
        expect(getPosition("h1").isWestTo(getPosition("a1"))).toBeTruthy();
        expect(getPosition("a1").isWestTo(getPosition("h1"))).toBeFalsy();
        expect(getPosition("h1").isWestTo(getPosition("f1"), 2)).toBeTruthy();
        expect(getPosition("h1").isWestTo(getPosition("f1"), 3)).toBeFalsy();

        expect(getPosition("h1").isNorthTo(getPosition("h8"))).toBeTruthy();
        expect(getPosition("h8").isNorthTo(getPosition("h1"))).toBeFalsy();
        expect(getPosition("h1").isNorthTo(getPosition("h3"), 2)).toBeTruthy();
        expect(getPosition("h1").isNorthTo(getPosition("h3"), 3)).toBeFalsy();

        expect(getPosition("a1").isEastTo(getPosition("h1"))).toBeTruthy();
        expect(getPosition("h1").isEastTo(getPosition("a1"))).toBeFalsy();
        expect(getPosition("a1").isEastTo(getPosition("c1"), 2)).toBeTruthy();
        expect(getPosition("a1").isEastTo(getPosition("c1"), 3)).toBeFalsy();

        expect(getPosition("h8").isSouthTo(getPosition("h1"))).toBeTruthy();
        expect(getPosition("h1").isSouthTo(getPosition("h8"))).toBeFalsy();
        expect(getPosition("h8").isSouthTo(getPosition("h6"), 2)).toBeTruthy();
        expect(getPosition("h8").isSouthTo(getPosition("h6"), 3)).toBeFalsy();
    });

    it("Detects if diagonal to another position or not", () => {
        expect(getPosition("a8").isDiagonalTo(getPosition("h1"))).toBeTruthy();
        expect(getPosition("h1").isDiagonalTo(getPosition("a8"))).toBeTruthy();
        expect(getPosition("a8").isDiagonalTo(getPosition("e2"))).toBeFalsy();
        expect(getPosition("a8").isDiagonalTo(getPosition("h1"), 7)).toBeTruthy();
        expect(getPosition("a8").isDiagonalTo(getPosition("h1"), 6)).toBeFalsy();
    });

    it("Detects if horizontal to another position or not", () => {
        expect(getPosition("a1").isHorizontalTo(getPosition("h1"))).toBeTruthy();
        expect(getPosition("h1").isHorizontalTo(getPosition("a1"))).toBeTruthy();
        expect(getPosition("a1").isHorizontalTo(getPosition("a8"))).toBeFalsy();

        expect(getPosition("a1").isHorizontalTo(getPosition("h1"), 7)).toBeTruthy();
        expect(getPosition("a1").isHorizontalTo(getPosition("h1"), 6)).toBeFalsy();
    });

    it("Detects if adjacent to another position or not", () => {
        expect(getPosition("e2").isAdjacentTo(getPosition("d3"))).toBeTruthy();
        expect(getPosition("e2").isAdjacentTo(getPosition("d2"))).toBeTruthy();
        expect(getPosition("e2").isAdjacentTo(getPosition("d1"))).toBeTruthy();
        expect(getPosition("e2").isAdjacentTo(getPosition("e3"))).toBeTruthy();
        expect(getPosition("e2").isAdjacentTo(getPosition("e1"))).toBeTruthy();
        expect(getPosition("e2").isAdjacentTo(getPosition("f3"))).toBeTruthy();
        expect(getPosition("e2").isAdjacentTo(getPosition("f2"))).toBeTruthy();
        expect(getPosition("e2").isAdjacentTo(getPosition("f1"))).toBeTruthy();

        expect(getPosition("e2").isAdjacentTo(getPosition("e2"))).toBeFalsy();
        expect(getPosition("e2").isAdjacentTo(getPosition("g2"))).toBeFalsy();

        expect(getPosition("e2").isAdjacentTo(getPosition("g3"), 2)).toBeTruthy();
        expect(getPosition("e2").isAdjacentTo(getPosition("h2"), 2)).toBeFalsy();
    });

    it("Detects if vertical to another position or not", () => {
        expect(getPosition("e2").isVerticalTo(getPosition("e7"))).toBeTruthy();
        expect(getPosition("e7").isVerticalTo(getPosition("e2"))).toBeTruthy();
        expect(getPosition("e2").isVerticalTo(getPosition("a1"))).toBeFalsy();

        expect(getPosition("a1").isVerticalTo(getPosition("a8"), 7)).toBeTruthy();
        expect(getPosition("a1").isVerticalTo(getPosition("a8"), 6)).toBeFalsy();
    });

    it("Detects if knight move or not", () => {
        expect(getPosition("e3").isKnightMoveTo(getPosition("d1"))).toBeTruthy();
        expect(getPosition("e3").isKnightMoveTo(getPosition("f1"))).toBeTruthy();
        expect(getPosition("e3").isKnightMoveTo(getPosition("c2"))).toBeTruthy();
        expect(getPosition("e3").isKnightMoveTo(getPosition("g2"))).toBeTruthy();
        expect(getPosition("e3").isKnightMoveTo(getPosition("c4"))).toBeTruthy();
        expect(getPosition("e3").isKnightMoveTo(getPosition("g4"))).toBeTruthy();
        expect(getPosition("e3").isKnightMoveTo(getPosition("d5"))).toBeTruthy();
        expect(getPosition("e3").isKnightMoveTo(getPosition("f5"))).toBeTruthy();

        expect(getPosition("e3").isKnightMoveTo(getPosition("e3"))).toBeFalsy();
        expect(getPosition("e3").isKnightMoveTo(getPosition("c5"))).toBeFalsy();
        expect(getPosition("e3").isKnightMoveTo(getPosition("e4"))).toBeFalsy();
        expect(getPosition("e3").isKnightMoveTo(getPosition("c3"))).toBeFalsy();
        expect(getPosition("e3").isKnightMoveTo(getPosition("b4"))).toBeFalsy();
    });

    it("Adjusts position to tileSize", () => {
        expect(new Position(100, 100).toGridPosition(100).toCoordinate()).toBe("b7")
    });

    it("Creates position from coordinate and object", () => {
        expect(Position.fromPositionOrCoordinate("a8").equals(getPosition("a8"))).toBeTruthy();
        expect(Position.fromPositionOrCoordinate({x: 4, y: 1}).equals(getPosition("e7"))).toBeTruthy();
    });
});