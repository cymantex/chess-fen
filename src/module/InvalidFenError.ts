export class InvalidFenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidFenError";
    }

    static invalidNumberOfFields(){
        return new InvalidFenError("The fen must contain six fields seperated by a single space")
    }

    static invalidMoveNumber(){
        return new InvalidFenError("The move number must be a positive integer");
    }

    static invalidHalfMoveNumber(){
        return new InvalidFenError("The half move number must be a positive integer");
    }

    static invalidEnPassantSquare(){
        return new InvalidFenError("The enpassant square must be a coordinate on the third of sixth rank");
    }

    static invalidCastlingAvailability(){
        return new InvalidFenError("The castling availability is invalid");
    }

    static invalidToMove(){
        return new InvalidFenError("The side to move must be either w or b");
    }
}