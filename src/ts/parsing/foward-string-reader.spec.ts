import ForwardStringReader from "./foward-string-reader";

test("Basic functionality", () => {
    const input = "abcdef";
    const reader = new ForwardStringReader(input);
    expect(reader.current).toBe("a");
    expect(reader.currentIndex).toBe(0);

    expect(reader.next()).toBe("b");
    expect(reader.current).toBe("b");
    expect(reader.currentIndex).toBe(1);

    expect(reader.length).toBe(input.length);
});

test("End of string management", () => {
    const input = "abc";
    const reader = new ForwardStringReader(input);

    expect(reader.current).toBe("a");
    for (let i = 1; i < input.length; i++) {
        expect(reader.next()).toBe(input[i]);
        expect(reader.current).toBe(input[i]);
        expect(reader.currentIndex).toBe(i);
    }

    expect(reader.next()).toBe(null);
    expect(reader.current).toBe(null);
    expect(reader.currentIndex).toBe(3);

    expect(reader.next()).toBe(null);
    expect(reader.current).toBe(null);
    expect(reader.currentIndex).toBe(3);
});

test("String extraction management", () => {
    const input = "abcdef";
    const reader = new ForwardStringReader(input);

    expect(reader.substring(0, 0)).toBe("");
    expect(reader.substring(0, 1)).toBe("a");
    expect(reader.substring(0, 3)).toBe("abc");
    expect(reader.substring(-1, 50)).toBe(input);
});

describe('Whitespace management', function () {
    test("Simple whitespaces", () => {
        const input = "0   abc";
        const reader = new ForwardStringReader(input);
    
        expect(reader.current).toBe("0");
        expect(reader.currentIndex).toBe(0);
    
        expect(reader.next()).toBe(" ");
    
        expect(reader.skipWhitespaces()).toBe(3);
        expect(reader.current).toBe("a");
        expect(reader.currentIndex).toBe(4);
    });

    test("Complex whitespaces", () => {
        const input = "\f\n\r\t\va\nbc";
        const reader = new ForwardStringReader(input);
        
        expect(reader.skipWhitespaces()).toBe(5);
        expect(reader.current).toBe("a");
        expect(reader.currentIndex).toBe(5);
    });
});