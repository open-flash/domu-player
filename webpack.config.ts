import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import sysPath from "path";
import ScriptExtPlugin from "script-ext-html-webpack-plugin";
import webpack from "webpack";

const PROJECT_ROOT: string = __dirname;

const files: ReadonlyArray<string> = [
  "index",
  "homestuck-beta",
  "homestuck-beta2",
  "squares",
  "morph",
  "shumway-3",
];

const config: webpack.Configuration = {
  entry: [
    sysPath.resolve(PROJECT_ROOT, "src", "main.browser.ts"),
  ],
  output: {
    path: sysPath.resolve(PROJECT_ROOT, "build", "browser", "scripts"),
    filename: "[name].js",
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
    ...files.map((name: string): webpack.Plugin => {
      return new HtmlWebpackPlugin({
        template: sysPath.resolve(PROJECT_ROOT, "src", "static", `${name}.html`),
        filename: sysPath.resolve(PROJECT_ROOT, "build", "browser", `${name}.html`),
        inject: "head",
      });
    }),
    new ScriptExtPlugin({
      defaultAttribute: "async",
    }) as webpack.Plugin,
    new CopyWebpackPlugin([
      {
        from: sysPath.resolve(PROJECT_ROOT, "src", "static", "**", "*.{gif,ico,jpg,png,svg,swf,css,js}"),
        to: sysPath.resolve(PROJECT_ROOT, "build", "browser"),
        context: sysPath.resolve(PROJECT_ROOT, "src", "static"),
        ignore: ["index.html"],
      },
    ]),
  ],
};

// tslint:disable-next-line:no-default-export
export default config;
