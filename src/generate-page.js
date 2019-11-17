const fs = require("fs");
const path = require("path");
const PageBuilder = require("webpage-templates").DemopageEmpty;

const DEST_DIR = path.resolve(__dirname, "..", "docs");
const PAGE_DATA_PATH = path.resolve(__dirname, "config", "page-data.json");
const minified = true;

PageBuilder.build(DEST_DIR, PAGE_DATA_PATH, !minified);

const sourceCss = path.resolve(__dirname, "static", "css", "demo.css");
const destinationCss = path.resolve(__dirname, "..", "docs", "css", "demo.css");

fs.copyFileSync(sourceCss, destinationCss);
