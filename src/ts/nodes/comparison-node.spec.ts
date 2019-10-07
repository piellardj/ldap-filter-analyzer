import { Comparison, ComparisonNode } from "./comparison-node";
import ForwardStringReader from "../foward-string-reader";

interface ValidInput {
    input: string,
    comparison: Comparison,
    left: string,
    right: string,
}

describe('ComparisonNode valid parsing', function () {
    const validInputsArray: ValidInput[] = [
        {
            input: "key~=value",
            comparison: Comparison.APPROX,
            left: "key",
            right: "value",
        },
        {
            input: "key=*value*",
            comparison: Comparison.CONTAINS,
            left: "key",
            right: "value",
        },
        {
            input: "key=*value***",
            comparison: Comparison.CONTAINS,
            left: "key",
            right: "value",
        },
        {
            input: "key=**value*",
            comparison: Comparison.CONTAINS,
            left: "key",
            right: "value",
        },
        {
            input: "key=*value",
            comparison: Comparison.ENDS_WITH,
            left: "key",
            right: "value",
        },
        {
            input: "key=***value",
            comparison: Comparison.ENDS_WITH,
            left: "key",
            right: "value",
        },
        {
            input: "key=value",
            comparison: Comparison.EQUALS,
            left: "key",
            right: "value",
        },
        {
            input: "key= ",
            comparison: Comparison.EQUALS,
            left: "key",
            right: " ",
        },
        {
            input: "key=*",
            comparison: Comparison.EXISTS,
            left: "key",
            right: "",
        },
        {
            input: "key=*****",
            comparison: Comparison.EXISTS,
            left: "key",
            right: "",
        },
        {
            input: "key>=value",
            comparison: Comparison.GREATER_OR_EQUALS,
            left: "key",
            right: "value",
        },
        {
            input: "key>value",
            comparison: Comparison.GREATER_THAN,
            left: "key",
            right: "value",
        },
        {
            input: "key=",
            comparison: Comparison.IS_EMPTY,
            left: "key",
            right: "",
        },
        {
            input: "key<=value",
            comparison: Comparison.LOWER_OR_EQUALS,
            left: "key",
            right: "value",
        },
        {
            input: "key<value",
            comparison: Comparison.LOWER_THAN,
            left: "key",
            right: "value",
        },
        {
            input: "key=value*",
            comparison: Comparison.STARTS_WITH,
            left: "key",
            right: "value",
        },
        {
            input: "key=value***",
            comparison: Comparison.STARTS_WITH,
            left: "key",
            right: "value",
        },
        {
            input: "éa¨çày=$%!",
            comparison: Comparison.EQUALS,
            left: "éa¨çày",
            right: "$%!",
        },
        {
            input: "éa¨çày=*$%!*",
            comparison: Comparison.CONTAINS,
            left: "éa¨çày",
            right: "$%!",
        },
        // TODO encoded characterss
    ];

    for (const validInput of validInputsArray) {
        test(validInput.input, () => {
            const comparisonNode = new ComparisonNode();
            expect(comparisonNode.parse(new ForwardStringReader(validInput.input))).toBe(true);
            expect(comparisonNode.startIndex).toBe(0);
            expect(comparisonNode.endIndex).toBe(validInput.input.length);

            expect(comparisonNode.comparison).toBe(validInput.comparison);
            expect(comparisonNode.leftHand).toBe(validInput.left);
            expect(comparisonNode.rightHand).toBe(validInput.right);
        });

        let input = "(" + validInput.input + ")";
        test(input, () => {
            const comparisonNode = new ComparisonNode();
            const reader = new ForwardStringReader(input);
            reader.next();
            expect(comparisonNode.parse(reader)).toBe(true);
            expect(comparisonNode.startIndex).toBe(1);
            expect(comparisonNode.endIndex).toBe(input.length - 1);

            expect(comparisonNode.comparison).toBe(validInput.comparison);
            expect(comparisonNode.leftHand).toBe(validInput.left);
            expect(comparisonNode.rightHand).toBe(validInput.right);
        });
    }
});

interface InvalidInput {
    input: string,
    errorPosition: number,
}

describe('ComparisonNode parsing error handling', function () {
    const invalidInputs: InvalidInput[] = [
        {
            input: "",
            errorPosition: 0,
        },
        {
            input: "key",
            errorPosition: 3,
        },
        {
            input: "key=value=value2",
            errorPosition: 9,
        },
        {
            input: "ke(y=value",
            errorPosition: 2,
        },
        {
            input: "key*=value",
            errorPosition: 3,
        },
        {
            input: "key=va*lue",
            errorPosition: 7,
        },
        {
            input: "key= **value",
            errorPosition: 7,
        },
    ];

    for (const invalidInput of invalidInputs) {
        test(invalidInput.input, () => {
            const comparisonNode = new ComparisonNode();
            expect(comparisonNode.parse(new ForwardStringReader(invalidInput.input))).toBe(false);
            expect(comparisonNode.error).toBeTruthy();
            expect(comparisonNode.error.position).toBe(invalidInput.errorPosition);
        });
    }
});