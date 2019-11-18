import INode from "./inode";
import ParsingError from "../parsing/parsing-error";

enum AggregationOperation {
    AND,
    OR,
    NOT,
}

class AggregationNode implements INode {
    public static isAggregationCharacter(character: string): boolean {
        return character === "&" || character === "|" || character === "!";
    }

    public startIndex: number;
    public endIndex: number;

    public operation: AggregationOperation = null;
    public children: INode[] = null;

    public constructor(operation: string) {
        this.children = [];

        if (operation === "&") {
            this.operation = AggregationOperation.AND;
        } else if (operation === "|") {
            this.operation = AggregationOperation.OR;
        } else if (operation === "!") {
            this.operation = AggregationOperation.NOT;
        } else {
            this.operation = null;
        }
    }

    public testValidity(): void {
        switch (this.operation) {
            case AggregationOperation.AND:
            case AggregationOperation.OR:
                if (this.children.length < 2) {
                    throw new ParsingError(this.endIndex, "Missing opening parenthesis. AND and OR nodes must have at least 2 subnodes.");
                }
                break;
            case AggregationOperation.NOT:
                if (this.children.length === 0) {
                    throw new ParsingError(this.endIndex, "Missing opening parenthesis. NOT nodes must have exactly 1 subnode.");
                } else if (this.children.length >= 2) {
                    throw new ParsingError(this.children[0].endIndex, "NOT nodes cannot have more than 1 subnode.");
                }
                break;
            default:
                throw new ParsingError(this.startIndex, "");
        }
    }

    public toString(): string {
        if (this.operation === AggregationOperation.NOT) {
            return "(!" + this.children[0].toString() + ")";
        }

        const childrenStrList: string[] = [];
        for (const child of this.children) {
            childrenStrList.push(child.toString());
        }

        if (this.operation === AggregationOperation.AND) {
            return "(&" + childrenStrList.join("") + ")";
        } else if (this.operation === AggregationOperation.OR) {
            return "(|" + childrenStrList.join("") + ")";
        }
        return "<empty>";
    }

    public toHTML(): HTMLElement {
        const divElement = document.createElement("div");
        divElement.className = "node";
        divElement.dataset.startIndex = this.startIndex.toString();
        divElement.dataset.endIndex = this.endIndex.toString();

        if (this.operation === AggregationOperation.AND || this.operation === AggregationOperation.OR) {
            divElement.appendChild(this.children[0].toHTML());

            const operatorText = (this.operation === AggregationOperation.AND) ? "and" : "or";

            for (let i = 1; i < this.children.length; i++) {
                const operatorElement = document.createElement("div");
                operatorElement.className = "operator";
                operatorElement.textContent = operatorText;

                divElement.appendChild(operatorElement);
                divElement.appendChild(this.children[i].toHTML());
            }
        } else if (this.operation === AggregationOperation.NOT) {
            const operatorElement = document.createElement("span");
            operatorElement.className = "operator";
            operatorElement.textContent = "not ";

            divElement.appendChild(operatorElement);
            const childElement = this.children[0].toHTML();
            childElement.classList.add("node-inline");
            divElement.appendChild(childElement);
        }
        return divElement;
    }
}

export default AggregationNode;
