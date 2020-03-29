export class InvalidMoveError extends Error {
    constructor(move: string, message: string) {
        super(`The move ${move} ${message}`);
        this.name = "InvalidMoveError";
    }

    static invalid(move: string){
        return new InvalidMoveError(move, `is invalid"`);
    }

    static unreachable(move: string) {
        return new InvalidMoveError(move, `cannot legally be reached by any piece on the board`);
    }

    static ambiguous(move: string) {
        return new InvalidMoveError(move, `is ambiguous`);
    }
}