const mapObject = (object, mappingFunction) => {
    return Object
        .keys(object)
        .map(mappingFunction)
        .reduce((objects, object) => ({...objects, ...object}));
};

export const sides = {
    queenside: "queenside",
    kingside: "kingside"
};
export const pieces = {
    pawn: "Pawn",
    rook: "Rook",
    knight: "Knight",
    bishop: "Bishop",
    queen: "Queen",
    king: "King"
};
export const colors = {
    white: "White",
    black: "Black"
};
export const emptySquare = "EmptySquare";
export const outsideBoard = "OutsideBoard";

export const blackPieces = mapObject(pieces, key => ({[key]: `${colors.black}${pieces[key]}`}));

export const whitePieces = mapObject(pieces, key => ({[key]: `${colors.white}${pieces[key]}`}));

export const fenToPiece = {
    p: blackPieces.pawn,
    n: blackPieces.knight,
    b: blackPieces.bishop,
    r: blackPieces.rook,
    q: blackPieces.queen,
    k: blackPieces.king,
    P: whitePieces.pawn,
    N: whitePieces.knight,
    B: whitePieces.bishop,
    R: whitePieces.rook,
    Q: whitePieces.queen,
    K: whitePieces.king
};

export const pieceToFen = mapObject(fenToPiece, key => ({[fenToPiece[key]]: key}));