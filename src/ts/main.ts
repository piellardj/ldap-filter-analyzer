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
        const node: INode = Parser.parseString(reader);
        return "valid '" + node.toString() + "'";
    } catch (e) {
        return e.toString();
    }
}

window.addEventListener("load", function analyzeAll(): void {
    for (const toAnalyze of testedStrings) {
        console.log(toAnalyze + " : " + analyze(new ForwardStringReader(toAnalyze)));
    }

    const errorMessageElement = document.getElementById("error-messages");
    const inputElement = document.getElementById("input") as HTMLTextAreaElement;
    const resultElement = document.getElementById("result");

    function updateResult(): void {
        const textToAnalyze: string = inputElement.value;
        const stringReader = new ForwardStringReader(textToAnalyze);

        let rootNode: INode;
        try {
            rootNode = Parser.parseString(stringReader);

            errorMessageElement.textContent = "";
            resultElement.innerHTML = "";
            resultElement.appendChild(rootNode.toHTML());
        } catch (e) {
            resultElement.innerHTML = "";
            errorMessageElement.textContent = e.toString();
        }
    }

    function updateInputHeight(): void {
        const inputPadding = 8;

        inputElement.style.overflow = 'hidden';
        inputElement.style.height = "0";
        inputElement.style.height = (inputElement.scrollHeight - 2 * inputPadding) + 'px';
    }

    inputElement.addEventListener("keyup", updateInputHeight);
    inputElement.addEventListener("input", updateResult);

    inputElement.value = "&((  |(hihi)(huhu)))   (huhu)";
    updateResult();
});

