const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: "./index.js",
    target: "node",
    devtool: "sourcemap",
    output: {
        path: path.join(__dirname, "build"),
        filename: "server.js"
    },
    module: {
        rules: [
            {
                test: /\.mjs$/,
                type: "javascript/auto",
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [ new TerserPlugin() ]
    },
    
};