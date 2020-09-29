import INode from "./inode";

enum EComparison {
    EQUALS,
    GREATER_THAN,
    GREATER_OR_EQUAL_THAN,
    LOWER_THAN,
    LOWER_OR_EQUAL_THAN,
    PROXIMITY,

    STARTS_WITH,
    ENDS_WITH,
    CONTAINS,
    EXISTS,
    IS_EMPTY,
}

class ComparisonNode implements INode {
    public static isComparisonCharacter(character: string): boolean {
        return character === "=" || character === "<" || character === ">" || character === "~";
    }

    public startIndex: number;
    public endIndex: number;

    public comparison: EComparison;

    public lefthand: string;
    public righthand: string;

    public constructor(lefthand: string, righthand: string, comparison: EComparison) {
        this.lefthand = lefthand;

        if (comparison === EComparison.EQUALS) {
            if (righthand.length === 0) {
                this.righthand = "";
                this.comparison = EComparison.IS_EMPTY;
            } else {
                let realRighthandStart = 0;
                while (realRighthandStart < righthand.length && righthand[realRighthandStart] === "*") {
                    realRighthandStart++;
                }

                if (realRighthandStart === righthand.length) {
                    this.comparison = EComparison.EXISTS;
                    this.righthand = "";
                } else {
                    let realRighthandEnd = righthand.length - 1;
                    while (realRighthandEnd > 0 && righthand[realRighthandEnd] === "*") {
                        realRighthandEnd--;
                    }

                    this.righthand = righthand.substring(realRighthandStart, realRighthandEnd + 1);

                    if (realRighthandStart !== 0 && realRighthandEnd !== righthand.length - 1) {
                        this.comparison = EComparison.CONTAINS;
                    } else if (realRighthandStart !== 0) {
                        this.comparison = EComparison.ENDS_WITH;
                    } else if (realRighthandEnd !== righthand.length - 1) {
                        this.comparison = EComparison.STARTS_WITH;
                    } else {
                        this.comparison = EComparison.EQUALS;
                    }
                }
            }
        } else {
            this.righthand = righthand;
            this.comparison = comparison;
        }
    }

    public toString(): string {
        if (this.comparison === EComparison.EQUALS) {
            return "(" + this.lefthand + "=" + this.righthand + ")";
        } else if (this.comparison === EComparison.GREATER_THAN) {
            return "(" + this.lefthand + ">" + this.righthand + ")";
        } else if (this.comparison === EComparison.GREATER_OR_EQUAL_THAN) {
            return "(" + this.lefthand + ">=" + this.righthand + ")";
        } else if (this.comparison === EComparison.LOWER_THAN) {
            return "(" + this.lefthand + "<" + this.righthand + ")";
        } else if (this.comparison === EComparison.LOWER_OR_EQUAL_THAN) {
            return "(" + this.lefthand + "<=" + this.righthand + ")";
        } else if (this.comparison === EComparison.PROXIMITY) {
            return "(" + this.lefthand + "~=" + this.righthand + ")";
        } else if (this.comparison === EComparison.STARTS_WITH) {
            return "(" + this.lefthand + "=" + this.righthand + "*)";
        } else if (this.comparison === EComparison.ENDS_WITH) {
            return "(" + this.lefthand + "=*" + this.righthand + ")";
        } else if (this.comparison === EComparison.CONTAINS) {
            return "(" + this.lefthand + "=*" + this.righthand + "*)";
        } else if (this.comparison === EComparison.EXISTS) {
            return "(" + this.lefthand + "=*)";
        } else if (this.comparison === EComparison.IS_EMPTY) {
            return "(" + this.lefthand + "=)";
        }

        return this.lefthand + " " + this.comparison + " " + this.righthand;
    }

    public toHTML(): HTMLElement {
        const divElement = document.createElement("div");
        divElement.className = "node";
        divElement.dataset.startIndex = this.startIndex.toString();
        divElement.dataset.endIndex = this.endIndex.toString();

        const leftElement = document.createTextNode(this.lefthand);
        const rightElement = document.createTextNode(this.righthand);

        const comparisonElement = document.createElement("span");
        comparisonElement.className = "comparison";

        if (this.comparison === EComparison.EXISTS) {
            comparisonElement.textContent = " exists";
            divElement.appendChild(leftElement);
            divElement.appendChild(comparisonElement);
        } else if (this.comparison === EComparison.IS_EMPTY) {
            comparisonElement.textContent = " is empty";
            divElement.appendChild(leftElement);
            divElement.appendChild(comparisonElement);
        } else {
            if (this.comparison === EComparison.EQUALS) {
                comparisonElement.textContent = " equals ";
            } else if (this.comparison === EComparison.GREATER_THAN) {
                comparisonElement.textContent = " greater than ";
            } else if (this.comparison === EComparison.GREATER_OR_EQUAL_THAN) {
                comparisonElement.textContent = " greater or equal than ";
            } else if (this.comparison === EComparison.LOWER_THAN) {
                comparisonElement.textContent = " lower than ";
            } else if (this.comparison === EComparison.LOWER_OR_EQUAL_THAN) {
                comparisonElement.textContent = " lower or equal than ";
            } else if (this.comparison === EComparison.PROXIMITY) {
                comparisonElement.textContent = " approx ";
            } else if (this.comparison === EComparison.STARTS_WITH) {
                comparisonElement.textContent = " starts with ";
            } else if (this.comparison === EComparison.ENDS_WITH) {
                comparisonElement.textContent = " ends with ";
            } else if (this.comparison === EComparison.CONTAINS) {
                comparisonElement.textContent = " contains ";
            }

            divElement.appendChild(leftElement);
            divElement.appendChild(comparisonElement);
            divElement.appendChild(rightElement);
        }

        return divElement;
    }
}

export {
    ComparisonNode,
    EComparison,
};
