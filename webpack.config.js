const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      // ...其他规则...
      {
        test: /\.module\.scss$/, // 只针对.module.scss文件应用以下loader
        use: [
          "style-loader", // 将JS字符串生成为style节点
          {
            loader: "css-loader", // 将CSS转化成CommonJS模块
            options: {
              importLoaders: 1, // 在css-loader前应用的loader数量
              modules: {
                localIdentName: "[name]__[local]___[hash:base64:5]", // 定义生成的类名格式
              },
            },
          },
          "sass-loader", // 将Sass编译成CSS
        ],
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/, // 排除.module.scss文件
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"), // 将@映射到项目的src目录
      // 可以添加更多的别名
    },
    extensions: [".tsx", ".ts", ".js", ".jsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    // new MiniCssExtractPlugin({
    //   filename: "styles.css",
    // }),
  ],
  devServer: {
    allowedHosts: "all",
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 8000,
  },
};
