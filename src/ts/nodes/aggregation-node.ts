import INode from "./inode";

enum AggregationOperation {
    AND,
    OR,
    NOT,
}

class AggregationNode implements INode {
    public startIndex: number;
    public endIndex: number;
    
    public operation: AggregationOperation = null;
    public children: INode[] = null;

    public static isAggregationCharacter(character: string): boolean {
        return character === "&" || character === "|" || character === "!";
    }

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

    public isValid(): boolean {
        switch (this.operation) {
            case AggregationOperation.AND:
            case AggregationOperation.OR:
                return this.children.length >= 2;
            case AggregationOperation.NOT:
                return this.children.length === 1;
            default:
                return false;
        }
    }

    public toString(): string {
        if (this.operation === AggregationOperation.NOT) {
            return "NOT " + this.children[0].toString();
        } else if (this.operation === AggregationOperation.AND) {
            const childrenStrList: string[] = [];
            for (const child of this.children) {
                childrenStrList.push(child.toString());
            }
            return "(" + childrenStrList.join(") AND (") + ")";
        } else if (this.operation === AggregationOperation.OR) {
            const childrenStrList: string[] = [];
            for (const child of this.children) {
                childrenStrList.push(child.toString());
            }
            return "(" + childrenStrList.join(") OR (") + ")";
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
        }
        return divElement;
    }
}

export default AggregationNode;
