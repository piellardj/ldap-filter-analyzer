import * as Encodings from "../encoding";
import ForwardStringReader from "../foward-string-reader";
import LdapNode from "./ldap-node";

enum Comparison {
    APPROX, //0
    CONTAINS,
    ENDS_WITH,
    EQUALS,
    EXISTS,
    GREATER_OR_EQUALS, //5
    GREATER_THAN,
    IS_EMPTY,
    LOWER_OR_EQUALS,
    LOWER_THAN,
    STARTS_WITH, //10
}

/* A comparison node is a terminal node in the form of 'titi=toto', 'titi=*', 'titi<=0' etc. */
class ComparisonNode extends LdapNode {
    public leftHand: string;
    public rightHand: string;
    public comparison: Comparison;

    public constructor() {
        super();
        this.leftHand = null;
        this.rightHand = null;
        this.comparison = null;
    }

    public parse(reader: ForwardStringReader): boolean {
        this.startIndex = reader.currentIndex;

        if (!this.parseLeftHand(reader) || !this.parseComparison(reader) || !this.parseRightHand(reader)) {
            this.moveForwardUntilEndOfNode(reader);
            this.endIndex = reader.currentIndex;
            return false;
        }

        this.endIndex = reader.currentIndex;
        return true;
    }

    public toString(): string {
        switch (this.comparison) {
            case Comparison.APPROX:
                return this.leftHand + " APPROX " + this.rightHand;
            case Comparison.CONTAINS:
                return this.leftHand + " CONTAINS " + this.rightHand;
            case Comparison.ENDS_WITH:
                return this.leftHand + " ENDS WITH " + this.rightHand;
            case Comparison.EQUALS:
                return this.leftHand + " EQUALS " + this.rightHand;
            case Comparison.EXISTS:
                return this.leftHand + " EXISTS";
            case Comparison.GREATER_OR_EQUALS:
                return this.leftHand + " GREATER OR EQUAL " + this.rightHand;
            case Comparison.GREATER_THAN:
                return this.leftHand + " GREATER THAN " + this.rightHand;
            case Comparison.IS_EMPTY:
                return this.leftHand + " IS EMPTY";
            case Comparison.LOWER_OR_EQUALS:
                return this.leftHand + " LOWER OR EQUAL " + this.rightHand;
            case Comparison.LOWER_THAN:
                return this.leftHand + " LOWER THAN " + this.rightHand;
            case Comparison.STARTS_WITH:
                return this.leftHand + " STARTS WITH " + this.rightHand;
            default:
                return "Unhandled Comparison " + JSON.stringify(this);
        }
    }

    private moveForwardUntilInvalidCharacter(reader: ForwardStringReader): void {
        while (!this.isEndOfNode(reader)) {
            switch (reader.current) {
                case "&":
                case "(":
                case ")":
                case "*":
                case "/":
                case ">":
                case "<":
                case "=":
                case "|":
                case "~":
                    return;
                case "\\":
                    if (reader.next() !== "\\") {
                        return;
                    }

                    const encoded = "\\\\" + reader.next() + reader.next();
                    if (!Encodings.isEncoded(encoded)) {
                        return;
                    }
                    break;
            }

            reader.next();
        }
    }

    /* Leaves the cursor at the start of the first non-lefthand character */
    private parseLeftHand(reader: ForwardStringReader): boolean {
        const leftStart: number = reader.currentIndex;
        this.moveForwardUntilInvalidCharacter(reader);

        if (reader.currentIndex === leftStart) {
            this.setError(reader.currentIndex, "Unexpected character '" + reader.current + "'");
            return false;
        }

        if (this.isEndOfNode(reader)) {
            this.setError(reader.currentIndex, "Comparison node missing operator.");
            return false;
        }

        this.leftHand = reader.substring(leftStart, reader.currentIndex);
        return true;
    }

    /* Leaves the cursor at the start of the righthand sequence.
     * If the righthand sequence has wildcards, then this.comparison is wrong at this point and will be corrected when parsing righthand. */
    private parseComparison(reader: ForwardStringReader): boolean {
        if (reader.current === "=") {
            this.comparison = Comparison.EQUALS;
            reader.next();
            return true;
        } else if (reader.current === "<") {
            if (reader.next() === "=") {
                this.comparison = Comparison.LOWER_OR_EQUALS;
                reader.next();
            } else {
                this.comparison = Comparison.LOWER_THAN;
            }
            return true;
        } else if (reader.current === ">") {
            if (reader.next() === "=") {
                this.comparison = Comparison.GREATER_OR_EQUALS;
                reader.next();
            } else {
                this.comparison = Comparison.GREATER_THAN;
            }
            return true;
        }
        else if (reader.current === "~" && reader.next() === "=") {
            this.comparison = Comparison.APPROX;
            reader.next();
            return true;
        }

        this.setError(reader.currentIndex, "Unexpected character '" + reader.current + "'.");
        return false;
    }

    /* Leaves the cursor at the node's ending (closing parenthesis or end of string).
     * Adjusts the comparison if the right hand contains wildcards. */
    private parseRightHand(reader: ForwardStringReader): boolean {
        /* First, consume all the starting wildcards if there are any. */
        let startsWithStars = false;
        while (!this.isEndOfNode(reader) && reader.current === "*") {
            startsWithStars = true;
            reader.next();
        }

        const rightStart: number = reader.currentIndex;
        this.moveForwardUntilInvalidCharacter(reader);
        this.rightHand = reader.substring(rightStart, reader.currentIndex);

        let endsWithStars = false;
        while (!this.isEndOfNode(reader) && reader.current === "*") {
            endsWithStars = true;
            reader.next();
        }

        if (!this.isEndOfNode(reader)) {
            this.setError(reader.currentIndex, "Asteriscs cannot be used in the middle of a word.");
            this.moveForwardUntilEndOfNode(reader);
            this.rightHand = reader.substring(rightStart, reader.currentIndex);
            return false;
        }

        /* Adjust comparison if wildcards were present */
        if (this.comparison === Comparison.EQUALS) {
            if (this.rightHand.length === 0) {
                if (startsWithStars || endsWithStars) {
                    this.comparison = Comparison.EXISTS;
                } else {
                    this.comparison = Comparison.IS_EMPTY;
                }
            } else {
                if (startsWithStars && endsWithStars) {
                    this.comparison = Comparison.CONTAINS;
                } else if (startsWithStars) {
                    this.comparison = Comparison.ENDS_WITH;
                } else if (endsWithStars) {
                    this.comparison = Comparison.STARTS_WITH;
                }
            }
        }

        return true;
    }
}

export {
    Comparison,
    ComparisonNode,
};
