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
        const textToAnalyze: string = inputElement.textContent;
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
    inputElement.addEventListener("keyup", updateResult);

    function highlightHoveredNode(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        const nodes = resultElement.querySelectorAll(".node");
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].classList.remove("hovered");
        }

        const hovered = (target as HTMLElement).closest("#result .node") as HTMLElement;
        if (hovered !== null) {
            hovered.classList.add("hovered");

            const startIndex = +hovered.dataset.startIndex;
            const endIndex = +hovered.dataset.endIndex;

            const inputText = inputElement.textContent;
            const nodes: any[] = [];
            nodes.push(document.createTextNode(inputText.substring(0, startIndex)));

            const span = document.createElement("span");
            span.className = "hovered";
            span.textContent = inputText.substring(startIndex, endIndex);
            nodes.push(span);

            nodes.push(document.createTextNode(inputText.substring(endIndex)));
            
            inputElement.innerHTML = "";
            for (let i = 0; i < nodes.length; i++) {
                inputElement.appendChild(nodes[i]);
            }
        } else {
            inputElement.textContent = inputElement.textContent;
        }
    }

    document.addEventListener("mousemove", highlightHoveredNode);

    inputElement.textContent = "&((  |(hihi)(huhu)))   (huhu)";
    updateResult();
});

