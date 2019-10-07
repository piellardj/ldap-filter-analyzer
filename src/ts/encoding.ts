const ENCODINGS = {};
ENCODINGS["\\26"] = "&";
ENCODINGS["\\28"] = "(";
ENCODINGS["\\29"] = ")";
ENCODINGS["\\2a"] = "*";
ENCODINGS["\\2f"] = "/";
ENCODINGS["\\3e"] = ">";
ENCODINGS["\\3c"] = "<";
ENCODINGS["\\3d"] = "=";
ENCODINGS["\\5c"] = "\\";
ENCODINGS["\\7c"] = "|";
ENCODINGS["\\7e"] = "~";

function decode(encoded: string): string | undefined {
    return ENCODINGS[encoded.toLowerCase()];
}

function isEncoded(encoded: string): boolean {
    return typeof decode(encoded) !== "undefined";
}

export {
    decode,
    isEncoded,
};
