import {createPlayer} from "./browser/domu-player";
import {all as polyfillAll} from "./browser/polyfills";

polyfillAll();

async function run() {
  {
    const root: HTMLDivElement = document.getElementById("domu-root") as HTMLDivElement;
    const src: string = "squares.swf";
    createPlayer(root, src);
  }
  {
    const root: HTMLDivElement = document.getElementById("domu-root2") as HTMLDivElement;
    const src: string = "morph.swf";
    createPlayer(root, src);
  }
}

run().catch((err: Error): never => {
  console.error(err.stack);
  // process.exit(1);
  return undefined as never;
});
