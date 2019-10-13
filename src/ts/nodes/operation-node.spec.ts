import { Comparison, ComparisonNode } from "./comparison-node";
import { Operation, OperationNode } from "./operation-node";
import ForwardStringReader from "../foward-string-reader";

interface ParsedComparisonNode {
    comparison: Comparison;
    left: string;
    right: string;
}

interface ValidInput {
    input: string,
    operation: Operation,
    children: ParsedComparisonNode[];
}

describe('OperationNode valid parsing', function () {
    const validInputsArray: ValidInput[] = [
        {
            input: "&(key1=value1)(key2~=value2)",
            operation: Operation.AND,
            children: [
                {
                    comparison: Comparison.EQUALS,
                    left: "key1",
                    right: "value1"
                },
                {
                    comparison: Comparison.APPROX,
                    left: "key2",
                    right: "value2"
                }
            ]
        },
        {
            input: "| \r\f   (key1>=  value1)    (key2<value2  )    ",
            operation: Operation.OR,
            children: [
                {
                    comparison: Comparison.GREATER_OR_EQUALS,
                    left: "key1",
                    right: "  value1"
                },
                {
                    comparison: Comparison.LOWER_THAN,
                    left: "key2",
                    right: "value2  "
                }
            ]
        },
    ];

    for (const validInput of validInputsArray) {
        test(validInput.input, () => {
            const operationNode = new OperationNode();
            expect(operationNode.parse(new ForwardStringReader(validInput.input))).toBe(true);
            expect(operationNode.startIndex).toBe(0);
            expect(operationNode.endIndex).toBe(validInput.input.length);

            expect(operationNode.operation).toBe(validInput.operation);
            expect(operationNode.children.length).toBe(validInput.children.length);
            for (let i = 0; i < operationNode.children.length; i++) {
                const parsed = operationNode.children[i] as ComparisonNode;
                expect(parsed.comparison).toBe(validInput.children[i].comparison);
                expect(parsed.leftHand).toBe(validInput.children[i].left);
                expect(parsed.rightHand).toBe(validInput.children[i].right);
            }
        });
    }
});

interface InvalidInput {
    input: string;
    errorPosition: number;
}

describe('OperationNode invalid parsing', function () {
    const invalidInputsArray: InvalidInput[] = [
        {
            input: "=(key1=value1)(key2~=value2)",
            errorPosition: 0,
        },
        {
            input: "&  &(key1=value1)(key2~=value2)",
            errorPosition: 3,
        }
    ];

    for (const invalidInput of invalidInputsArray) {
        test(invalidInput.input, () => {
            const operationNode = new OperationNode();
            expect(operationNode.parse(new ForwardStringReader(invalidInput.input))).toBe(false);
            expect(operationNode.startIndex).toBe(0);
            expect(operationNode.endIndex).toBe(invalidInput.input.length);
            expect(operationNode.error).toBeTruthy();
            expect(operationNode.error.position).toBe(invalidInput.errorPosition);
        });
    }
});