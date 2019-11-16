import ForwardStringReader from "./parsing/foward-string-reader";
import Parser from "./parsing/parser";

import INode from "./nodes/inode";

const testedStrings: string[] = [
    "",
    "()",
    "((()))",
    "  (  ( ()) )",
    "(",
    " ( (())",
    "(()&",
    "(hihi)",
    "( (hihi)       )",
    "&(hoho)(huhu)",
    "  |   (hoho)   (huhu)",
    "&((  |(hihi)(huhu)))   (huhu)",
    "&()(huhu)(haha)",
    "!(huhu)",
    "!(huhu)(haha)",
];

function analyze(reader: ForwardStringReader): string {
    try {
        const node: INode = Parser.parseNode(reader);
        const mainElement = document.querySelector("main");

        const blockElement = document.createElement("div");
        blockElement.className = "block";

        blockElement.appendChild(node.toHTML());
        mainElement.appendChild(blockElement);

        return "valid '" + node.toString() + "'";
    } catch (e) {
        return e.toString();
    }
}

window.addEventListener("load", function analyzeAll(): void {
    for (const toAnalyze of testedStrings) {
        console.log(toAnalyze + " : " + analyze(new ForwardStringReader(toAnalyze)));
    }
});
