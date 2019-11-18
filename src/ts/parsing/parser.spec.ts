import ForwardStringReader from "./foward-string-reader";
import LdapNode from "../nodes/inode";
import Parser from "./parser";
import ParsingError from "./parsing-error";

function testErrorDetection(caseName: string, input: string, errorPosition: number): void {
    const reader = new ForwardStringReader(input);

    let error: ParsingError = null;
    try {
        Parser.parseString(reader);
    } catch (e) {
        error = e;
    }

    test(caseName + ": " + input, () => {
        expect(error).toBeTruthy();
        expect(error.position).toBe(errorPosition);
    });
}

describe("Errors detection", function () {
    testErrorDetection("Empty input", "", 0);

    testErrorDetection("No comparison 1", "haha", 4);
    testErrorDetection("No comparison 2", "(haha)", 5);

    testErrorDetection("No left term 1", "=hoho", 0);
    testErrorDetection("No left term 2", "(<=hoho)", 1);
    testErrorDetection("No left term 3", "&(key=value)(=hoho)", 13);

    testErrorDetection("No right term 1", "haha=", 5);
    testErrorDetection("No right term 1", "(haha>=)", 7);
    testErrorDetection("No right term 1", "&(key=value)(haha=)", 18);

    testErrorDetection("Missing closing parenthesis 1", "(haha=hoho", 10);
    testErrorDetection("Missing closing parenthesis 2", "&((haha=hoho)(key=value))", 13);
    testErrorDetection("Missing closing parenthesis 3", "((((haha=hoho)))", 16);

    testErrorDetection("Incomplete AND node 1", "&", 1);
    testErrorDetection("Incomplete AND node 2", "&(key=value)", 12);

    testErrorDetection("Incomplete OR node 1", "|", 1);
    testErrorDetection("Incomplete OR node 2", "|(key=value)", 12);

    testErrorDetection("Incomplete NOT node 1", "!", 1);
    testErrorDetection("Incomplete NOT node 2", "!(key=value)(key=value)", 11);
});
