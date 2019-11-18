import ForwardStringReader from "./foward-string-reader";
import LdapNode from "../nodes/inode";
import Parser from "./parser";
import ParsingError from "./parsing-error";

function testErrorDetection(input: string, errorPosition: number): void {
    const reader = new ForwardStringReader(input);

    let error: ParsingError = null;
    try {
        Parser.parseString(reader);
    } catch (e) {
        error = e;
    }

    expect(error).toBeTruthy();
    expect(error.position).toBe(errorPosition);
}

describe('Errors detection', function () {
    test("Empty input", () => {
        testErrorDetection("", 0);
    });

    test("No comparison 1", () => {
        testErrorDetection("haha", 4);
    });
    test("No comparison 2", () => {
        testErrorDetection("(haha)", 5);
    });

    test("No left term 1", () => {
        testErrorDetection("=hoho", 0);
    });
    test("No left term 2", () => {
        testErrorDetection("(<=hoho)", 1);
    });
    test("No left term 3", () => {
        testErrorDetection("&(key=value)(=hoho)", 13);
    });

    test("No right term 1", () => {
        testErrorDetection("haha=", 5);
    });
    test("No right term 2", () => {
        testErrorDetection("(haha>=)", 7);
    });
    test("No right term 2", () => {
        testErrorDetection("&(key=value)(haha=)", 18);
    });

    test("Missing closing parenthesis 1", () => {
        testErrorDetection("(haha=hoho", 10);
    });
    test("Missing closing parenthesis 2", () => {
        testErrorDetection("&((haha=hoho)(key=value))", 13);
    });

    test("Incomplete AND node 1", () => {
        testErrorDetection("&", 1);
    });
    test("Incomplete AND node 2", () => {
        testErrorDetection("&(key=value)", 12);
    });

    test("Incomplete OR node 1", () => {
        testErrorDetection("|", 1);
    });
    test("Incomplete OR node 2", () => {
        testErrorDetection("|(key=value)", 12);
    });

    test("Incomplete NOT node 1", () => {
        testErrorDetection("!", 1);
    });
    test("Overcomplete NOT node 2", () => {
        testErrorDetection("!(key=value)(key=value)", 11);
    });
});