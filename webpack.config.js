const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path');

module.exports = {
	mode: "development",
	devtool: "source-map",
	entry: "./src/app.ts",
	output: {
		filename: 'assets/js/bundle.[hash].js'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.scss'],
	},
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							"presets": ["@babel/preset-env"]
						}
					},
					{
						loader: "ts-loader",
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					process.env === 'production' ?
						{
							loader: MiniCssExtractPlugin.loader,
						} :
						{
							loader: 'style-loader',
						},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							importLoaders: 1
						}
					},
					{
						loader: 'postcss-loader',
						options: { sourceMap: true, config: { path: 'src/scss/postcss.config.js' } }
					},
					{
						loader: 'sass-loader',
						options: { sourceMap: true }
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new MiniCssExtractPlugin({
			filename: 'assets/css/[name].[hash].css'
		}),
		new CleanWebpackPlugin(),
	],
	devServer: {
		port: 8080,
		hot: true
	}
}