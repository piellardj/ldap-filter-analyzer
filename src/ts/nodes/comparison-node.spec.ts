import { ComparisonNode, EComparison } from "./comparison-node";

function testConversion(expected: EComparison, righthand: string): void {
    const node = new ComparisonNode("lefthand", righthand, EComparison.EQUALS);
    expect(node.comparison).toBe(expected);
}

describe("Comparison node: conversion of EQUALS operator", function () {
    test("Equals conversion to EQUALS", function () {
        testConversion(EComparison.EQUALS, "");
        testConversion(EComparison.EQUALS, "haha");
    });

    test("Equals conversion to ENDS_WITH", function () {
        testConversion(EComparison.ENDS_WITH, "*haha");
        testConversion(EComparison.ENDS_WITH, "****haha");
    });

    test("Equals conversion to STARTS_WITH", function () {
        testConversion(EComparison.STARTS_WITH, "haha*");
        testConversion(EComparison.STARTS_WITH, "haha*****");
    });

    test("Equals conversion to CONTAINS", function () {
        testConversion(EComparison.CONTAINS, "*haha*");
        testConversion(EComparison.CONTAINS, "*haha*****");
        testConversion(EComparison.CONTAINS, "******haha*");
        testConversion(EComparison.CONTAINS, "******haha*****");
    });

    test("Equals conversion to EXISTS", function () {
        testConversion(EComparison.EXISTS, "*");
        testConversion(EComparison.EXISTS, "******");
    });
});