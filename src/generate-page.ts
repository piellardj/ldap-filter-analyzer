import * as fs from "fs";
import * as path from "path";
import { DemopageEmpty } from "webpage-templates";

const data = {
    title: "LDAP filter analyzer",
    description: "Simple LDAP filter formatter",
    introduction: [
        "This is a simple analyzer to help visualize LDAP filters. The analyzed result can be hovered to see where each node was extracted from.",
        "<p>The LDAP syntax is described <a href=\"http://www.ldapexplorer.com/en/manual/109010000-ldap-filter-syntax.htm\">here</a>.</p>"
    ],
    githubProjectName: "ldap-filter-analyzer",
    additionalLinks: [],
    scriptFiles: [
        "script/main.min.js"
    ],
    cssFiles: [
        "css/demo.css"
    ],
    body: "<div id=\"contents\">\n\t<div id=\"input\" contenteditable=\"true\" class=\"section\"></div>\n\t<div id=\"action-section\">\n\t\t<button id=\"trigger-analyze\">Analyze</button>\n\t\t<div id=\"error-messages\">\n\t\t\t<noscript>You need to enable Javascript to run this experiment.</noscript>\n\t\t</div>\n\t</div>\n\t<div id=\"result\" class=\"section\"></div>\n</div>"
};

const DEST_DIR = path.resolve(__dirname, "..", "docs");
const minified = true;

const buildResult = DemopageEmpty.build(data, DEST_DIR, {
    debug: !minified,
});

// disable linting on this file because it is generated
buildResult.pageScriptDeclaration = "/* tslint:disable */\n" + buildResult.pageScriptDeclaration;

const SCRIPT_DECLARATION_FILEPATH = path.resolve(__dirname, ".", "ts", "page-interface-generated.ts");
fs.writeFileSync(SCRIPT_DECLARATION_FILEPATH, buildResult.pageScriptDeclaration);

const sourceCss = path.resolve(__dirname, "static", "css", "demo.css");
const destinationCss = path.resolve(__dirname, "..", "docs", "css", "demo.css");

fs.copyFileSync(sourceCss, destinationCss);
