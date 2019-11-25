import ForwardStringReader from "./foward-string-reader";
import ParsingError from "./parsing-error";

import AggregationNode from "../nodes/aggregation-node";
import { ComparisonNode, EComparison } from "../nodes/comparison-node";
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

        partialNode.testValidity();

        return partialNode;
    }

    private static parseNodeInnerComparison(input: ForwardStringReader): ComparisonNode {
        const startIndex = input.currentIndex;

        let comparison: EComparison = null;

        const leftStartIndex = input.currentIndex;
        let leftEndIndex = null;

        let rightStartIndex = null;
        let rightEndIndex = null;
        while (!input.endOfString && input.current !== ")") {
            if (leftEndIndex === null && ComparisonNode.isComparisonCharacter(input.current)) {
                leftEndIndex = input.currentIndex;

                if (leftEndIndex === startIndex) {
                    throw new ParsingError(input.currentIndex, "Missing left term of comparison");
                }

                if (input.current === "=") {
                    comparison = EComparison.EQUALS;
                } else if (input.current === "<") {
                    if (input.next() !== "=") {
                        throw new ParsingError(input.currentIndex, "Expected '=' character");
                    }
                    comparison = EComparison.LOWER_THAN;
                } else if (input.current === ">") {
                    if (input.next() !== "=") {
                        throw new ParsingError(input.currentIndex, "Expected '=' character");
                    }
                    comparison = EComparison.GREATER_THAN;
                } else if (input.current === "~") {
                    if (input.next() !== "=") {
                        throw new ParsingError(input.currentIndex, "Expected '=' character");
                    }
                    comparison = EComparison.PROXIMITY;
                }

                rightStartIndex = input.currentIndex + 1;
            }

            input.next();
        }

        if (comparison === null) {
            throw new ParsingError(input.currentIndex, "Expected comparison operator '=', '<=', '>=' or '~='");
        }

        rightEndIndex = input.currentIndex;

        const lefthand = input.substring(leftStartIndex, leftEndIndex);
        const righthand = input.substring(rightStartIndex, rightEndIndex);

        const node = new ComparisonNode(lefthand, righthand, comparison);
        node.startIndex = startIndex;
        node.endIndex = input.currentIndex;

        if (node.comparison !== EComparison.IS_EMPTY && rightEndIndex === rightStartIndex) {
            throw new ParsingError(input.currentIndex, "Missing right term of comparison");
        }

        return node;
    }
}

export default Parser;
