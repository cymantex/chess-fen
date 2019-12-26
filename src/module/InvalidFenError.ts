export class InvalidFenError extends Error {
    constructor(fen: string) {
        super(`${fen} is not a valid FEN.`);
        this.name = "InvalidFenError";
    }
}

export default InvalidFenError;