const path = require("path");

const PROJECT_DIR = path.resolve(__dirname, "..", "..");

module.exports = {
    roots: [path.join(PROJECT_DIR, "src")],
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
    moduleFileExtensions: ["ts", "js", "json", "node"],
}