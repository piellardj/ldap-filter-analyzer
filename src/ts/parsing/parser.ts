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

        if (AggregationNode.isAggregationCharacter(input.current)) {
            return Parser.parseNodeInnerAggregation(input);
        } else {
            return Parser.parseNodeInnerComparison(input);
        }
    }

    private static parseNodeInnerAggregation(input: ForwardStringReader): AggregationNode {
        const partialNode = new AggregationNode(input.current);
        partialNode.startIndex = input.currentIndex;

        input.next();
        input.skipWhitespaces();
        while (input.current === "(") {
            partialNode.children.push(Parser.parseNode(input));
            input.skipWhitespaces();
        }

        partialNode.endIndex = input.currentIndex;

        if (!partialNode.isValid()) {
            throw new ParsingError(input.currentIndex, "Invalid agregation node");
        }

        return partialNode;
    }

    private static parseNodeInnerComparison(input: ForwardStringReader): ComparisonNode {
        const startIndex = input.currentIndex;
        while (!input.endOfString && input.current !== ")") {
            input.next();
        }
        const node = new ComparisonNode(input.substring(startIndex, input.currentIndex));
        node.startIndex = startIndex;
        node.endIndex = input.currentIndex;
        return node;
    }
}

export default Parser;
