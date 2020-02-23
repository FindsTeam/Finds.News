const path = require("path");
const webpack = require("webpack");
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
            },
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: [ "eslint-loader" ]
            }
        ]
    },
    plugins: [
        new webpack.IgnorePlugin(/^encoding$/, /node-fetch/)
    ],
    optimization: {
        minimize: true,
        minimizer: [ new TerserPlugin() ]
    },
};