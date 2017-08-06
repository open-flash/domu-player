import webpackMerge = require("webpack-merge");
import {getBrowserPartial} from "./webpack/browser.webpack";
import {getCommonPartial} from "./webpack/common.webpack";

export function getWebpackConfiguration (options: any, webpackOptions: any): any {
  options = options || {};

  const configs: any = {};

  const isProduction: boolean = Boolean(options.production);

  configs.browser = webpackMerge({}, <any> getCommonPartial(isProduction), <any> getBrowserPartial(isProduction));

  const builds: any = [];
  builds.push(configs.browser);

  return builds;
}

export default getWebpackConfiguration;
