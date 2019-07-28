import {Fen} from "../module/Fen";
import _ from "lodash";
import {Position} from "../module/Position";
import {isObstructedPath} from "../module/utils";

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

it("Detects if horizontal path is obstructed or not", () => {
    const fen = new Fen("8/8/8/1p2R1p1/8/8/8/8 w - - 0 1");
    expect(isObstructedPath(board.e5, board.h5, fen)).toBeTruthy();
    expect(isObstructedPath(board.e5, board.a5, fen)).toBeTruthy();
    expect(isObstructedPath(board.e5, board.g5, fen)).toBeFalsy();
    expect(isObstructedPath(board.e5, board.b5, fen)).toBeFalsy();
});

it("Detects if vertical path is obstructed or not", () => {
    const fen = new Fen("8/4p3/8/4R3/8/4p3/8/8 w - - 0 1");
    expect(isObstructedPath(board.e5, board.e8, fen)).toBeTruthy();
    expect(isObstructedPath(board.e5, board.e1, fen)).toBeTruthy();
    expect(isObstructedPath(board.e5, board.e7, fen)).toBeFalsy();
    expect(isObstructedPath(board.e5, board.e3, fen)).toBeFalsy();
});

it("Detects if diagonal path is obstructed or not", () => {
    const fen = new Fen("8/8/2p3p1/8/4B3/8/2p3p1/8 w - - 0 1");
    expect(isObstructedPath(board.e4, board.h1, fen)).toBeTruthy();
    expect(isObstructedPath(board.e4, board.a8, fen)).toBeTruthy();
    expect(isObstructedPath(board.e4, board.b1, fen)).toBeTruthy();
    expect(isObstructedPath(board.e4, board.h7, fen)).toBeTruthy();
    expect(isObstructedPath(board.e4, board.g2, fen)).toBeFalsy();
    expect(isObstructedPath(board.e4, board.c2, fen)).toBeFalsy();
    expect(isObstructedPath(board.e4, board.c6, fen)).toBeFalsy();
    expect(isObstructedPath(board.e4, board.g6, fen)).toBeFalsy();
});