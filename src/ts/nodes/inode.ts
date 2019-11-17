interface INode {
    startIndex: number;
    endIndex: number;

    toString: () => string;
    toHTML: () => HTMLElement;
}

export default INode;
