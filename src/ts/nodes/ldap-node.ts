import ForwardStringReader from "../foward-string-reader";
import ParsingError from "../parsing-error";

abstract class LdapNode {
    /* 0-based index of the first and last characters for this node (parenthesis not included). */
    public startIndex: number | null;
    public endIndex: number | null;

    private _error: ParsingError | null;

    protected constructor() {
        this.startIndex = null;
        this.endIndex = null;
        this._error = null;
    }

    /* Should be called when the cursor is just after the opening parenthesis.
     * Returns whether or not the parsing was successfull.
     * Leaves the cursor at the node's closing parenthesis, or end of string. */
    public abstract parse(reader: ForwardStringReader): boolean;

    /* Returns a text representation of the node, without enclosing parenthesis. */
    public abstract toString(): string;

    public get error(): ParsingError | null {
        return this._error;
    }

    protected setError(location: number, message: string): void {
        this._error = new ParsingError(location, message);
    }

    protected isEndOfNode(reader: ForwardStringReader): boolean {
        return reader.endOfString || reader.current === ")";
    }

    protected moveForwardUntilEndOfNode(reader: ForwardStringReader): void {
        let closingParenthesisToIgnore = 1;
        while (!reader.endOfString) {
            if (reader.current === "(") {
                closingParenthesisToIgnore++;
            } else if (reader.current === ")") {
                closingParenthesisToIgnore--;
                if (closingParenthesisToIgnore < 0) {
                    return;
                }
            }

            reader.next();
        }
    }
}

export default LdapNode;
