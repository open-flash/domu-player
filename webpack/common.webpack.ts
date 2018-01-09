import {resolve as resolvePath} from "path";
import {DefinePlugin} from "webpack";
import UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const projectRoot: string = resolvePath(__dirname, "..");

export function getCommonPartial(isProduction: boolean): any {
  return {
    devtool: isProduction ? undefined : "source-map",
    plugins: !isProduction ? [] : [
      new DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production"),
        },
      }),
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: !isProduction,
        uglifyOptions: {
          ecma: 8,
        },
      }),
    ],
  };
}
