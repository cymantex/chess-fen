import {Fen} from "../module/Fen";
import {Position} from "../module/Position";
import {isObstructedPath} from "../module/utils";

const getPosition = (coordinate: string): Position => {
    return Position.fromCoordinate(coordinate);
};

describe("Utils tests", () => {
    it("Detects if horizontal path is obstructed or not", () => {
        const fen = new Fen("8/8/8/1p2R1p1/8/8/8/8 w - - 0 1");
        expect(isObstructedPath(getPosition("e5"), getPosition("h5"), fen)).toBeTruthy();
        expect(isObstructedPath(getPosition("e5"), getPosition("a5"), fen)).toBeTruthy();
        expect(isObstructedPath(getPosition("e5"), getPosition("g5"), fen)).toBeFalsy();
        expect(isObstructedPath(getPosition("e5"), getPosition("b5"), fen)).toBeFalsy();
    });

    it("Detects if vertical path is obstructed or not", () => {
        const fen = new Fen("8/4p3/8/4R3/8/4p3/8/8 w - - 0 1");
        expect(isObstructedPath(getPosition("e5"), getPosition("e8"), fen)).toBeTruthy();
        expect(isObstructedPath(getPosition("e5"), getPosition("e1"), fen)).toBeTruthy();
        expect(isObstructedPath(getPosition("e5"), getPosition("e7"), fen)).toBeFalsy();
        expect(isObstructedPath(getPosition("e5"), getPosition("e3"), fen)).toBeFalsy();
    });

    it("Detects if diagonal path is obstructed or not", () => {
        const fen = new Fen("8/8/2p3p1/8/4B3/8/2p3p1/8 w - - 0 1");
        expect(isObstructedPath(getPosition("e4"), getPosition("h1"), fen)).toBeTruthy();
        expect(isObstructedPath(getPosition("e4"), getPosition("a8"), fen)).toBeTruthy();
        expect(isObstructedPath(getPosition("e4"), getPosition("b1"), fen)).toBeTruthy();
        expect(isObstructedPath(getPosition("e4"), getPosition("h7"), fen)).toBeTruthy();
        expect(isObstructedPath(getPosition("e4"), getPosition("g2"), fen)).toBeFalsy();
        expect(isObstructedPath(getPosition("e4"), getPosition("c2"), fen)).toBeFalsy();
        expect(isObstructedPath(getPosition("e4"), getPosition("c6"), fen)).toBeFalsy();
        expect(isObstructedPath(getPosition("e4"), getPosition("g6"), fen)).toBeFalsy();
    });
});