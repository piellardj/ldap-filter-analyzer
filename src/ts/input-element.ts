class InputElement {
    public element: HTMLElement;

    public constructor(elementId: string) {
        const element = document.getElementById(elementId);

        element.addEventListener("keyup", function updateInputHeight(): void {
            const inputPadding = 8;

            element.style.overflow = "hidden";
            element.style.height = "0";
            element.style.height = (element.scrollHeight - 2 * inputPadding) + "px";
        });

        this.element = element;
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
        let inputText = this.text;

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
