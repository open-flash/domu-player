declare module "script-ext-html-webpack-plugin" {
  namespace ScriptExtPlugin {
    interface Options {
      defaultAttribute?: "async";
    }

    interface ScriptExtPluginConstructor {
      new(options: Options): ScriptExtPlugin;
    }

    interface ScriptExtPlugin {
    }
  }

  /* tslint:disable-next-line:variable-name */
  const ScriptExtPlugin: ScriptExtPlugin.ScriptExtPluginConstructor;

  export = ScriptExtPlugin;
}
