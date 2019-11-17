import ForwardStringReader from "./parsing/foward-string-reader";
import Parser from "./parsing/parser";

import INode from "./nodes/inode";

import InputElement from "./input-element";
import ParsingError from "./parsing/parsing-error";

window.addEventListener("load", function analyzeAll(): void {
    const errorMessageElement = document.getElementById("error-messages");
    const inputElement = new InputElement("input");
    const analyzeButton = document.getElementById("trigger-analyze");
    const resultElement = document.getElementById("result");

    let lastText = inputElement.text;
    function updateResult(): void {
        const textToAnalyze: string = inputElement.text;
        
        if (textToAnalyze === lastText) {
            lastText = textToAnalyze;
            return;
        }
        lastText = textToAnalyze;

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

            const parsingError = e as ParsingError;
            inputElement.applyClassToSubstring(parsingError.position, parsingError.position + 1, "error");
        }
    }

    analyzeButton.addEventListener("click", updateResult);
    inputElement.element.addEventListener("keydown", function (event: KeyboardEvent) {
        console.log(event.keyCode);
        if (event.keyCode === 13) {// enter
            event.preventDefault();
            updateResult();
        }
    });

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

