import ForwardStringReader from "./foward-string-reader";
import ParsingError from "./parsing-error";

import AggregationNode from "../nodes/aggregation-node";
import ComparisonNode from "../nodes/comparison-node";
import LdapNode from "../nodes/inode";

class Parser {
    public static parseString(input: ForwardStringReader): LdapNode {
        const result: LdapNode = Parser.parseNode(input);
        
        if (!input.endOfString) {
            throw new ParsingError(input.currentIndex, "Invalid character");
        }

        return result;
    }

    /** Leaves the cursor after the last ')' */
    private static parseNode(input: ForwardStringReader): LdapNode {
        let nbClosingParenthesisExpected = 0;
        let node: LdapNode = null;

        input.skipWhitespaces();
        while (input.current === "(") {
            nbClosingParenthesisExpected++;
            input.next();
            input.skipWhitespaces();
        }

        if (input.current === ")") {
            throw new ParsingError(input.currentIndex, "Invalid empty node");
        }

        node = Parser.parseNodeInner(input);

        if (!input.endOfString && input.current !== ")") {
            throw new ParsingError(input.currentIndex, "Invalid character");
        }

        while (input.current === ")" && nbClosingParenthesisExpected > 0) {
            nbClosingParenthesisExpected--;

            input.next();
            input.skipWhitespaces();
        }

        if (nbClosingParenthesisExpected > 0) {
            throw new ParsingError(input.currentIndex, "Missing closing parenthesis");
        }

        return node;
    }

    private static parseNodeInner(input: ForwardStringReader): LdapNode {
        input.skipWhitespaces();

        let node : LdapNode = null;
        while (!input.endOfString && input.current !== ")") {
            if (AggregationNode.isAggregationCharacter(input.current)) {
                const partialNode = new AggregationNode(input.current);

                input.next();
                input.skipWhitespaces();
                while (input.current === "(") {
                    partialNode.children.push(Parser.parseNode(input));
                    input.skipWhitespaces();
                }

                if (!partialNode.isValid()) {
                    throw new ParsingError(input.currentIndex, "Invalid agregation node");
                }

                node = partialNode;
            } else {
                const startIndex = input.currentIndex;
                while (!input.endOfString && input.current !== ")") {
                    input.next();
                }
                node = new ComparisonNode(input.substring(startIndex, input.currentIndex));
            }
        }

        return node;
    }
}

export default Parser;
