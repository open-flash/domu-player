import CopyWebpackPlugin = require("copy-webpack-plugin");
import HtmlWebpackPlugin = require("html-webpack-plugin");
import ScriptExtPlugin = require("script-ext-html-webpack-plugin");
import {resolve as resolvePath} from "path";

const projectRoot: string = resolvePath(__dirname, "..");

export function getBrowserPartial(isProduction: boolean): any {
  return {
    entry: [
      resolvePath(projectRoot, "src", "main.browser.ts"),
    ],
    output: {
      path: resolvePath(projectRoot, "build", "browser", "scripts"),
      filename: isProduction ? "[name].[chunkhash].js" : "[name].js",
    },
    resolve: {
      extensions: [".js", ".json", ".ts"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: "ts-loader",
          options: {
            configFile: "browser.tsconfig.json",
            onlyCompileBundledFiles: true,
            // visualStudioErrorFormat: true,
            compilerOptions: {
              declaration: false,
            },
          },
        },
      ],
    },
    target: "web",
    plugins: [
      // TODO: Ignore bson and unorm once kryo with optional dependencies is released
      // new IgnorePlugin(/^(?:bson|unorm)$/),
      new HtmlWebpackPlugin({
        template: resolvePath(projectRoot, "src", "static", "index.html"),
        filename: resolvePath(projectRoot, "build", "browser", "index.html"),
        inject: "head",
      }),
      new ScriptExtPlugin({
        defaultAttribute: "async",
      }),
      new CopyWebpackPlugin([
        {
          from: resolvePath(projectRoot, "src", "static", "**", "*.{gif,ico,jpg,png,svg,swf,css,js}"),
          to: resolvePath(projectRoot, "build", "browser"),
          context: resolvePath(projectRoot, "src", "static"),
          ignore: ["index.html"],
        },
      ]),
    ],
  };
}
