# chess-fen
chess-fen is a library which includes tools for working with Forsyth–Edwards Notation (FEN) in an immutable manner.

## Installation
``npm install chess-fen``

## Example usage
````javascript
const emptyPosition = new Fen(Fen.emptyPosition);

const {BlackKing, BlackPawn, BlackRook, BlackQueen, WhiteKnight, WhiteQueen, WhiteKing} = BoardContent;

//Each update() and move() creates a new Fen instance.
const smotheredMate = emptyPosition
    .update("h8", BlackKing)
    .update("h7", BlackPawn)
    .update("g7", BlackPawn)
    .update("e8", BlackRook)
    .update("a8", BlackQueen)
    .update("g5", WhiteKnight)
    .update("c4", WhiteQueen)
    .update("h2", WhiteKing)
    .move("Nf7+")
    .move("Kg8")
    .move("Nh6+")
    .move("Kh8")
    .move("Qg8+!")
    .move("Rxg8")
    .move("Nf7#");

smotheredMate.printBoard();
// -------------------
// | q . . . . . r k |
// | . . . . . N p p |
// | . . . . . . . . |
// | . . . . . . . . |
// | . . . . . . . . |
// | . . . . . . . . |
// | . . . . . . . K |
// | . . . . . . . . |
// -------------------

// The original Fen will not be mutated
emptyPosition.printBoard();
// -------------------
// | . . . . . . . . |
// | . . . . . . . . |
// | . . . . . . . . |
// | . . . . . . . . |
// | . . . . . . . . |
// | . . . . . . . . |
// | . . . . . . . . |
// | . . . . . . . . |
// -------------------
````

## API
### Constructor: Fen(fen?: string)
The constructor takes an optional parameter which specifies the FEN board position.
````javascript
const startingPosition = new Fen();

console.log(startingPosition.toString());
// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

console.log(new Fen("rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2").toString());
// rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2

console.log(new Fen(Fen.emptyPosition).toString());
// 8/8/8/8/8/8/8/8 w KQkq - 0 1
````

### get(Coordinate|Position)
Gets the content of the specified position.
````javascript
const startingPosition = new Fen();

console.log(startingPosition.get("e1"));
// white king

console.log(startingPosition.get("e4"));
// empty

console.log(startingPosition.get("k9"));
// null

// You can also send the x and y as a Position.
console.log(startingPosition.get(new Position(4, 7)));
// white king
````

### clear(Coordinate|Position)
Removes the content on the specified position if there is any.
````javascript
console.log(new Fen().clear("e1").toString());
// "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQ1BNR w KQkq - 0 1"
````

### update(Coordinate|Position, BoardContent)
Replaces the content of the specified position.
````javascript
console.log(new Fen().update("e1", BoardContent.BlackBishop).toString());
// rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQbBNR w KQkq - 0 1
````

### isOccupied(Coordinate|Position)
````javascript
const startingPosition = new Fen();

console.log(startingPosition.isOccupied("e2"));
// true

console.log(startingPosition.isOccupied("e4"));
// false
````

### isEmpty(Coordinate|Position)
````javascript
const startingPosition = new Fen();

console.log(startingPosition.isEmpty("e2"));
// false

console.log(startingPosition.isEmpty("e4"));
// true
````

### move(StandardNotation|MoveArgs)
Makes a move and updates FEN related properties accordingly. It will however not try to validate if the move is legal or not.
````javascript
import {Position} from "chess-fen";

const startingPosition = new Fen();

console.log(startingPosition.move("Nf3").toString());
// rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1

console.log(startingPosition.move("Ng1-f3").toString());
// rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1

console.log(startingPosition.move({from: "g1", to: "f3"}).toString());
// rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1

console.log(startingPosition.move({from: new Position(6, 7), to: new Position(5, 5)}).toString());
// rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1
````

### Properties
````javascript
console.log(new Fen());
// Fen {
//     toMove: 'white',
//     castlingRights: {
//         white: { queenside: true, kingside: true },
//         black: { queenside: true, kingside: true }
//     },
//     enPassantSquare: '-',
//     halfMoves: 0,
//     fullMoves: 1
//     board: [
//         [
//             'black rook',
//             'black knight',
//             'black bishop',
//             'black queen',
//             'black king',
//             'black bishop',
//             'black knight',
//             'black rook'
//         ],
//         [
//             'black pawn',
//             'black pawn',
//             'black pawn',
//             'black pawn',
//             'black pawn',
//             'black pawn',
//             'black pawn',
//             'black pawn'
//         ],
//         [
//             'empty', 'empty',
//             'empty', 'empty',
//             'empty', 'empty',
//             'empty', 'empty'
//         ],
//         [
//             'empty', 'empty',
//             'empty', 'empty',
//             'empty', 'empty',
//             'empty', 'empty'
//         ],
//         [
//             'empty', 'empty',
//             'empty', 'empty',
//             'empty', 'empty',
//             'empty', 'empty'
//         ],
//         [
//             'empty', 'empty',
//             'empty', 'empty',
//             'empty', 'empty',
//             'empty', 'empty'
//         ],
//         [
//             'white pawn',
//             'white pawn',
//             'white pawn',
//             'white pawn',
//             'white pawn',
//             'white pawn',
//             'white pawn',
//             'white pawn'
//         ],
//         [
//             'white rook',
//             'white knight',
//             'white bishop',
//             'white queen',
//             'white king',
//             'white bishop',
//             'white knight',
//             'white rook'
//         ]
//     ]
// }
````

