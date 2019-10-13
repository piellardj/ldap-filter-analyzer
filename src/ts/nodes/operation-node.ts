import { ComparisonNode } from "./comparison-node";
import LdapNode from "./ldap-node";
import ForwardStringReader from "../foward-string-reader";

enum Operation {
    AND,
    OR,
    NOT,
}

class OperationNode extends LdapNode {
    public operation: Operation;
    public children: LdapNode[];

    public constructor() {
        super();
        this.operation = null;
        this.children = [];
    }

    /* Reader should be at a '&', '|' or '!' character. */
    public parse(reader: ForwardStringReader): boolean {
        this.startIndex = reader.currentIndex;

        if (reader.current === "&") {
            this.operation = Operation.AND;
        } else if (reader.current === "|") {
            this.operation = Operation.OR;
        } else if (reader.current === "!") {
            this.operation = Operation.NOT;
        } else {
            this.setError(reader.currentIndex, "Unexpected character '" + reader.current + "'");
        }

        reader.next();
        reader.skipWhitespaces();

        if (reader.current !== "(") {
            this.setError(reader.currentIndex, "Unexpected character '" + reader.current + "'");
        }
        
        while (reader.current === "(") {
            reader.next();

            const childNode = new ComparisonNode();
            if (childNode.parse(reader)) {
                this.children.push(childNode);
            }

            reader.next(); // skip ")"
            reader.skipWhitespaces();
        }

        this.moveForwardUntilEndOfNode(reader);

        this.endIndex = reader.currentIndex;
        reader.next();
        return !this.error;
    }

    public isValid(): boolean {
        switch (this.operation) {
            case Operation.AND:
            case Operation.OR:
                return this.children.length >= 2;
            case Operation.NOT:
                return this.children.length === 1;
            default:
                return false;
        }
    }

    public toString(): string {
        const childrenStringArray: String[] = [];
        for (const child of this.children) {
            childrenStringArray.push(child.toString());
        }

        switch (this.operation) {
            case Operation.AND:
                return childrenStringArray.join(" AND ");
            case Operation.OR:
                return childrenStringArray.join(" OR ");
            case Operation.NOT:
                if (this.children.length !== 1) {
                    return "(INVALID OPERATION NODE: NOT SHOULD HAVE ONE CHILD";
                }
                return "NOT " + childrenStringArray[0];
            default:
                return "INVALID OPERATION NODE: UNKNOWN OPERATION";
        }
    }
}

export {
    Operation,
    OperationNode,
}
