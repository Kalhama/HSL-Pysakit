/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, argv) => {
    const { mode } = argv

    return {
        entry: path.join(__dirname, 'src', 'Root.tsx'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
            assetModuleFilename: mode === 'development' ? 'assets/[name][ext][query]' : 'assets/[hash][ext][query]'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'src', 'index.html')
            }),
            new MiniCssExtractPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            // new BundleAnalyzerPlugin()
        ],
        resolve: {
            extensions: ['.json', '.tsx', '.ts', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.?jsx$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react']
                        }
                    }
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader',
                        }
                    ]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        'style-loader',
                        // Translates CSS into CommonJS
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                        // Compiles Sass to CSS
                    ]
                },
                {
                    test: /\.png/,
                    type: 'asset/resource'
                }
            ]
        },
        devServer: {
            hot: true,
            historyApiFallback: true
        },
        optimization: {
            minimize: mode !== 'development',
            minimizer: [new TerserPlugin(), new CssMinimizerPlugin(),],
        },
        mode: mode === 'development' ? 'development' : 'production'
    }
}

