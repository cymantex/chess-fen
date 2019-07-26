import {Position} from "../module/Position";

let a8 = null;
let e7 = null;
let e2 = null;
let h1 = null;
let a1 = null;

beforeEach(() => {
    a8 = new Position(0, 0);
    e7 = new Position(4, 1);
    e2 = new Position(4, 6);
    h1 = new Position(7, 7);
    a1 = new Position(0, 7);
});


it("Creates position from object", () => {
    expect(Position.from({x: 4, y: 1}).isEqualTo(e7)).toBeTruthy();
});

it("Properly converts coordinate to position", () => {
    expect(Position.fromCoordinate("a8").isEqualTo(a8)).toBeTruthy();
    expect(Position.fromCoordinate("e7").isEqualTo(e7)).toBeTruthy();
    expect(Position.fromCoordinate("e2").isEqualTo(e2)).toBeTruthy();
    expect(Position.fromCoordinate("h1").isEqualTo(h1)).toBeTruthy();
});

it("Converts position to coordinate", () => {
    expect(a8.toCoordinate()).toBe("a8");
    expect(e7.toCoordinate()).toBe("e7");
    expect(e2.toCoordinate()).toBe("e2");
    expect(h1.toCoordinate()).toBe("h1");
});

it("Increases position", () => {
    expect(e7.increaseBy(new Position(2, 2)).toCoordinate()).toBe("g5")
});

it("Detects if diagonal to another position or not", () => {
    expect(a8.isDiagonalTo(h1)).toBeTruthy();
    expect(h1.isDiagonalTo(a8)).toBeTruthy();
    expect(a8.isDiagonalTo(e2)).toBeFalsy();
});

it("Detects if horizontal to another position or not", () => {
    expect(a1.isHorizontalTo(h1)).toBeTruthy();
    expect(h1.isHorizontalTo(a1)).toBeTruthy();
    expect(a1.isHorizontalTo(a8)).toBeFalsy();
});

it("Detects if vertical to another position or not", () => {
    expect(e2.isVerticalTo(e7)).toBeTruthy();
    expect(e7.isVerticalTo(e2)).toBeTruthy();
    expect(e2.isVerticalTo(a1)).toBeFalsy();
});

it("Adjust position to tileSize", () => {
    expect(new Position(100, 100).toGridPosition(100).toCoordinate()).toBe("b7")
});

it("Creates position from coordinate and object", () => {
    expect(Position.fromPositionOrCoordinate("a8").isEqualTo(a8)).toBeTruthy();
    expect(Position.fromPositionOrCoordinate({x: 4, y: 1}).isEqualTo(e7)).toBeTruthy();
});