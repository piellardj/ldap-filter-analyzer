const path = require("path");

const PROJECT_DIR = path.resolve(__dirname, "..", "..");

module.exports = {
    mode: "development",
    entry: path.join(PROJECT_DIR, "src", "ts", "test", "test.ts"),
    output: {
        filename: "test.js",
        path: path.join(PROJECT_DIR, "test")
    },
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            //   transpileOnly: true,
                            compilerOptions: {
                                rootDir: path.join(PROJECT_DIR, "src", "ts")
                            },
                            configFile: path.join(PROJECT_DIR, "src", "config", 'tsconfig.test.json')
                        }
                    }
                ],
            }
        ]
    }
}
