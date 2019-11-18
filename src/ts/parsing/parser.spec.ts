import ForwardStringReader from "./foward-string-reader";
import Parser from "./parser";
import ParsingError from "./parsing-error";

function testErrorDetection(testName: string, input: string, errorPosition: number): void {
    const reader = new ForwardStringReader(input);

    let error: ParsingError = null;
    try {
        Parser.parseString(reader);
    } catch (e) {
        error = e;
    }

    test(testName + ": " + input, () => {
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
    testErrorDetection("No right term 2", "(haha>=)", 7);
    testErrorDetection("No right term 3", "&(key=value)(haha=)", 18);

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

function testValidInput(testName: string, input: string, expectedOutput: string): void {
    const reader = new ForwardStringReader(input);

    let node = null;
    try {
        node = Parser.parseString(reader);
    } catch (e) {
        expect(true).toBe(false);
    }

    test(testName + ": " + input, () => {
        expect(node.toString()).toBe(expectedOutput);
    });
}

describe("Errors detection", function () {
    testValidInput("Simplification 1", "(((key=value)))", "(key=value)");
    testValidInput("Simplification 2", "(( &   (key=value)((key=***))))", "(&(key=value)(key=*))");
    
    testValidInput("Comparison 1", " key=value", "(key=value)");
    testValidInput("Comparison 2", " key=***value", "(key=*value)");
    testValidInput("Comparison 3", " key=value**", "(key=value*)");
    testValidInput("Comparison 4", " key=*****", "(key=*)");
    testValidInput("Comparison 5", " key=**value**", "(key=*value*)");
    testValidInput("Comparison 6", " key>=value", "(key>=value)");
    testValidInput("Comparison 7", " key<=value", "(key<=value)");
    testValidInput("Comparison 8", " key~=value", "(key~=value)");

    testValidInput("Aggregation 1", "& (key1=value1)(key2<=value2)", "(&(key1=value1)(key2<=value2))");
    testValidInput("Aggregation 2", "&  (key1=value1)(key2=****value2)", "(&(key1=value1)(key2=*value2))");
    testValidInput("Aggregation 3", " |(key1=value1) (key2<=value2)", "(|(key1=value1)(key2<=value2))");
    testValidInput("Aggregation 4", "|(key1=value1)  (key2=****value2)", "(|(key1=value1)(key2=*value2))");
    testValidInput("Aggregation 5", " ( !   (key1=value1))", "(!(key1=value1))");

    testValidInput("Complex 1", " &(key1=**)\n ((|(key=value)(key2<=5)(!((hihi=haha)))))", "(&(key1=*)(|(key=value)(key2<=5)(!(hihi=haha))))");
});