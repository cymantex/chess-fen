# chess-fen

chess-fen is a library which includes tools for working with Forsyth–Edwards Notation (FEN) in an
immutable manner.

## Installation

`npm install chess-fen`

## Example usage

````javascript
const emptyPosition = new Fen(Fen.emptyPosition);

//Each update() creates a new Fen instance.
const smotheredMate = emptyPosition
  .update("h8", PIECES.k)
  .update("h7", PIECES.p)
  .update("g7", PIECES.p)
  .update("e8", PIECES.r)
  .update("a8", PIECES.q)
  .update("g5", PIECES.N)
  .update("c4", PIECES.Q)
  .update("h2", PIECES.K);

smotheredMate.printBoard();
// -------------------
// | q . . . r . . k |
// | . . . . . . p p |
// | . . . . . . . . |
// | . . . . . . N . |
// | . . Q . . . . . |
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

### Constructor: Fen(fenOrArgs?: string | FenArgs)

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
// K

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

### Properties

````javascript
console.log(new Fen(Fen.startingPosition));
// Fen {
//   rows: 8,
//   columns: 8,
//   board: [
//     ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
//     ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
//     [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//     [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//     [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//     [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
//     ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
//     ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
//   ],
//   toMove: 'white',
//   castlingRights: {
//     white: { queenside: true, kingside: true },
//     black: { queenside: true, kingside: true }
//   },
//   enPassantSquare: '-',
//   halfMoves: 0,
//   fullMoves: 1
// }
````

