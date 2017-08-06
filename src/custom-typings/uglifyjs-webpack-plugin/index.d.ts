declare module "uglifyjs-webpack-plugin" {
  namespace UglifyJSPlugin {
    interface Options {
      parallel?: boolean;
      sourceMap?: boolean;
      uglifyOptions?: any;
    }

    interface UglifyJSPluginConstructor {
      new(options: Options): UglifyJSPlugin;
    }

    interface UglifyJSPlugin {
    }
  }

  /* tslint:disable-next-line:variable-name */
  const UglifyJSPlugin: UglifyJSPlugin.UglifyJSPluginConstructor;

  export = UglifyJSPlugin;
}
