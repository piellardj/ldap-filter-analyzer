/* Class for storing parsing errors */
class ParsingError {
    public readonly position: number;
    public readonly message: string;

    constructor(position: number, message: string) {
        this.position = position;
        this.message = message;
    }

    public toString(): string {
        return "Parsing error at " + this.position + ": " + this.message;
    }
}

export default ParsingError;
