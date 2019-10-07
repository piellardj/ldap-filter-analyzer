/** Class for reading string character by character, only in forward direction.
 * It still allows substrings to be extracted from the string.
 */
class ForwardStringReader {
    private readonly stringToRead: string;
    private cursor: number;

    public constructor(stringToRead: string) {
        this.stringToRead = stringToRead;
        this.cursor = 0;
    }

    /** Retrieves the character at the cursor's current position, or null if it reached end of string. */
    public get current(): string | null {
        return this.endOfString ? null : this.stringToRead[this.cursor];
    }

    /** Retrieves the 0-based current position of the cursor. */
    public get currentIndex(): number {
        return this.cursor;
    }

    /** Moves the cursor forward and returns the new selected character, or null if te cursor reached the end of the string. */
    public next(): string | null {
        this.cursor++;
        return this.current;
    }

    public get endOfString(): boolean {
        return this.cursor >= this.stringToRead.length;
    }

    /** Returns the length of the read string. */
    public get length(): number {
        return this.stringToRead.length;
    }

    public substring(start: number, end: number): string {
        return this.stringToRead.substring(start, end);
    }
}

export default ForwardStringReader;
