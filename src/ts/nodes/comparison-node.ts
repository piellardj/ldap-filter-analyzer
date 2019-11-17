import INode from "./inode";

class ComparisonNode implements INode {
    public startIndex: number;
    public endIndex: number;
    
    public inner: string;

    public constructor (inner: string) {
        this.inner = inner;
    }

    public toString(): string {
        return this.inner;
    }

    public toHTML(): HTMLElement {
        const divElement = document.createElement("div")
        divElement.className = "node";
        divElement.textContent = this.inner;

        return divElement;
    }
}

export default ComparisonNode;