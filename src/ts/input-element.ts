class InputElement {
    public readonly element: HTMLElement;

    public constructor(elementId: string) {
        this.element = document.getElementById(elementId);
    }

    public get text(): string {
        return this.element.textContent;
    }
    public set text(text: string) {
        this.element.textContent = text;
    }

    public clearHighlight(): void {
        this.text = this.element.textContent;
    }

    public applyClassToSubstring(startIndex: number, endIndex: number, classname: string): void {
        const inputText = this.text;

        if (startIndex >= inputText.length) {
            startIndex = inputText.length - 1;
            endIndex = inputText.length;
        }

        const left = document.createTextNode(inputText.substring(0, startIndex));

        const middle = document.createElement("span");
        middle.className = classname;
        middle.textContent = inputText.substring(startIndex, endIndex);

        const right = document.createTextNode(inputText.substring(endIndex));

        this.element.innerHTML = "";
        this.element.appendChild(left);
        this.element.appendChild(middle);
        this.element.appendChild(right);
    }
}

export default InputElement;
