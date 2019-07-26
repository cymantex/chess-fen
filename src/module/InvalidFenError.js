export class InvalidFenError extends Error {
    constructor(fen) {
        super(`${fen} is not a valid FEN.`);
        this.name = "InvalidFenError";
    }
}