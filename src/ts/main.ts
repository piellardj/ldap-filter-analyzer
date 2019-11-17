import ForwardStringReader from "./parsing/foward-string-reader";
import Parser from "./parsing/parser";

import INode from "./nodes/inode";

import InputElement from "./input-element";

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
    const inputElement = new InputElement("input");
    const resultElement = document.getElementById("result");

    function updateResult(): void {
        const textToAnalyze: string = inputElement.text;
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

    inputElement.addInputEventListener(updateResult);

    function highlightHoveredNode(event: MouseEvent): void {
        const hoveredNode = (event.target as HTMLElement).closest("#result .node") as HTMLElement;

        let highlightCleared = false;

        const nodes = resultElement.querySelectorAll(".node");
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i] !== hoveredNode && nodes[i].classList.contains("hovered")) {
                highlightCleared = true;
                nodes[i].classList.remove("hovered");
            }
        }

        if (hoveredNode !== null && !hoveredNode.classList.contains("hovered")) {
            hoveredNode.classList.add("hovered");

            const startIndex = +hoveredNode.dataset.startIndex;
            const endIndex = +hoveredNode.dataset.endIndex;
            inputElement.applyClassToSubstring(startIndex, endIndex, "hovered");
        } else if (highlightCleared) {
            inputElement.clearHighlight();
        }
    }

    document.addEventListener("mousemove", highlightHoveredNode);

    inputElement.text = "&((  |(hihi)(huhu)))   (huhu)";
    updateResult();
});

