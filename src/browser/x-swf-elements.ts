import { createDomuPlayer, Dimensions, DomuPlayer } from "./domu-player";
import { FixedHTMLEmbedElement } from "./html-embed-element";

// Default size of an <embed> element (Firefox 59)
const DEFAULT_WIDTH: number = 240;
const DEFAULT_HEIGHT: number = 200;

// https://helpx.adobe.com/flash/kb/flash-object-embed-tag-attributes.html
export class XSwfElement extends HTMLElement implements FixedHTMLEmbedElement {
  private domuPlayer: DomuPlayer;

  get name(): string {
    return this.getAttribute("name") || "";
  }

  set name(value: string) {
    this.setAttribute("name", value);
  }

  get src(): string {
    return this.getAttribute("src") || "";
  }

  set src(value: string) {
    this.setAttribute("src", value);
  }

  get width(): string {
    return this.getAttribute("width") || "";
  }

  set width(value: string) {
    this.setAttribute("width", value);
  }

  get height(): string {
    return this.getAttribute("height") || "";
  }

  set height(value: string) {
    this.setAttribute("height", value);
  }

  constructor() {
    super();
    const size: Dimensions = this.getSize();
    this.domuPlayer = createDomuPlayer({container: this, viewportSize: size});
    this.style.display = "inline-block";
    this.style.width = `${size.width}px`;
    this.style.height = `${size.height}px`;

    const src: string | null = this.getAttribute("src");
    if (src === null) {
      return;
    }
    this.domuPlayer.setMovieUrl(src);
  }

  private getSize(): Dimensions {
    const widthAttr: string | null = this.getAttribute("width");
    let width: number = widthAttr === null ? DEFAULT_WIDTH : parseInt(widthAttr, 10);
    if (isNaN(width)) {
      width = DEFAULT_WIDTH;
    }
    const heightAttr: string | null = this.getAttribute("height");
    let height: number = heightAttr === null ? DEFAULT_HEIGHT : parseInt(heightAttr, 10);
    if (isNaN(width)) {
      height = DEFAULT_HEIGHT;
    }
    return {width, height};
  }

  static get observedAttributes(): string[] {
    return [
      "width",
      "height",
      "src",
      // "pluginspage",
      "src",
      "id",
      "play",
      "loop",
      "menu",
      "quality",
      "scale",
      "align",
      "salign",
      "wmode",
      "bgcolor",
      "base",
      "allowFullScreen",
      "fullScreenAspectRatio",
      "flashvars",
      "browserzoom",
    ];
  }
}
