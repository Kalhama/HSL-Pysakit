/* eslint-disable */

var path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { EnvironmentPlugin } = require('webpack')
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')

module.exports = (env, argv) => {
    return {
        entry: ['babel-polyfill', './src/main.js'],
        output: {
            path: path.resolve(__dirname, './build'),
            filename: 'main.js',
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.s?[ac]ss$/i, // matches also .ass files :D
                    use: [
                        // Creates `style` nodes from JS strings
                        // false || process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'resolve-url-loader',
                            options: { sourceMap: true }
                        },
                        // Compiles Sass to CSS
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
                },
                {
                    test: /\.(otf|ttf|eot|svg|png|jpe?g|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader'
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin(),
            new CopyPlugin([
                {
                    from: '**/*',
                    context: 'src/static'
                }
            ]),
            new EnvironmentPlugin({
                NODE_ENV: env || 'production', // use 'production' unless process.env.NODE_ENV is defined
            })
        ],
        devtool: 'source-map',
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            historyApiFallback: true
        }
    }
}
