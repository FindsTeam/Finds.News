const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: "production",
    entry: "./index.js",
    target: "node",
    output: {
        path: path.join(__dirname, "build"),
        filename: "bot.js"
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
    externals: [ nodeExternals() ]
};