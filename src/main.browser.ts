import { Incident } from "incident";
import { all as polyfillAll } from "./browser/polyfills";
import { createDomuPlayer, DomuPlayer } from "./browser/domu-player";
import { XSwfElement } from "./browser/x-swf-elements";

polyfillAll();

try {
  customElements.define("x-swf", XSwfElement);
} catch (err) {
  console.error(err);
}

const containers: HTMLCollectionOf<Element> = document.getElementsByClassName("domu-player");
const containerCount: number = containers.length;
for (let i: number = 0; i < containerCount; i++) {
  const container: Element = containers[i];
  if (!(container instanceof HTMLElement)) {
    throw new Incident("Expected container to be an `HTMLElement`");
  }
  const src: string | undefined = container.dataset.src;
  if (src === undefined) {
    throw new Incident("Missing `data-src` attribute");
  }
  const domuPlayer: DomuPlayer = createDomuPlayer({container});
  domuPlayer.setMovieUrl(src);
}
