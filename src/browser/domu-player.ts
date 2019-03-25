import elementResizeDetector from "element-resize-detector";
import { Incident } from "incident";
import { CanvasRenderer } from "swf-renderer/renderers/canvas-renderer";
import { NoopBitmapService } from "swf-renderer/renderers/noop-bitmap-service";
import { PlayerInterface, startPlayer } from "../lib/player";
import { SYSTEM_CLOCK } from "../lib/services/clock";
import { SchedulableClock } from "../lib/types/clock";

export interface Dimensions {
  width: number;
  height: number;
}

export interface DomuPlayerOptions {
  container: HTMLElement;

  /**
   * Strategy for the viewport size.
   * - `"containerContent"`: Automatically track the content size of the container. You can use is to control the size
   *                         by defining the layout of the container with CSS.
   * - `Dimensions`: Fixed dimensions matching the provided values.
   * Default: `containerContent`.
   */
  viewportSize?: "containerContent" | Dimensions;

  clock?: SchedulableClock;
}

function getContentDimensions(element: HTMLElement): Dimensions {
  const style: CSSStyleDeclaration = getComputedStyle(element);
  // `parseFloat` is used because the values are strings (suffixed by `px`).
  const paddingX: number = parseFloat(style.paddingLeft!) + parseFloat(style.paddingRight!);
  const paddingY: number = parseFloat(style.paddingTop!) + parseFloat(style.paddingBottom!);
  const borderX: number = parseFloat(style.borderLeftWidth!) + parseFloat(style.borderRightWidth!);
  const borderY: number = parseFloat(style.borderTopWidth!) + parseFloat(style.borderBottomWidth!);

  return {
    width: element.offsetWidth - paddingX - borderX,
    height: element.offsetHeight - paddingY - borderY,
  };
}

function resetStyle(element: HTMLElement): void {
  element.style.width = "0";
  element.style.height = "0";
  element.style.padding = "0";
  element.style.margin = "0";
  element.style.border = "none";
}

export class DomuPlayer {
  readonly container: HTMLElement;

  private readonly root: HTMLSpanElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly renderer: CanvasRenderer;
  private readonly clock: SchedulableClock;
  private player?: PlayerInterface;

  private get containerResizeDetector(): elementResizeDetector.Erd {
    if (this._containerResizeDetector === undefined) {
      this._containerResizeDetector = elementResizeDetector({strategy: "scroll"});
    }
    return this._containerResizeDetector;
  }

  private _containerResizeDetector?: elementResizeDetector.Erd;

  private get containerResizeListener(): () => void {
    if (this._containerResizeListener === undefined) {
      this._containerResizeListener = () => this.handleViewportResize(getContentDimensions(this.container));
    }
    return this._containerResizeListener;
  }

  private _containerResizeListener?: () => void;

  /**
   * Viewport size: match containerContent or fixed dimensions
   */
  public get viewportSize(): "containerContent" | Readonly<Dimensions> {
    return this._viewportSize;
  }

  public set viewportSize(value: "containerContent" | Readonly<Dimensions>) {
    if (value === "containerContent") {
      if (this._viewportSize === "containerContent") {
        return;
      }
      this._viewportSize = "containerContent";
      this.containerResizeDetector.listenTo(this.container, this.containerResizeListener);
      this.handleViewportResize(getContentDimensions(this.container));
    } else {
      if (this._viewportSize === "containerContent") {
        this.containerResizeDetector.removeListener(this.container, this.containerResizeListener);
      }
      const newSize: Dimensions = Object.freeze({width: value.width, height: value.height});
      this._viewportSize = newSize;
      this.handleViewportResize(newSize);
    }
  }

  private _viewportSize!: "containerContent" | Readonly<Dimensions>;

  constructor(options: DomuPlayerOptions) {
    const container: HTMLElement = options.container;
    if (Reflect.get(container, "domuPlayer") !== undefined) {
      throw new Incident("DuplicatePlayer", "Cannot acquire ownership of container: already owned");
    }
    if (container.childNodes.length !== 0) {
      throw new Incident(
        "NonEmptyContainer",
        "The container used for the domu player must be empty (`container.childNodes.length === 0`)",
      );
    }
    // Signal exclusive ownership of the container
    Reflect.set(container, "domuPlayer", this);

    try {
      this.container = container;
      this.root = document.createElement("span");
      this.canvas = document.createElement("canvas");

      resetStyle(this.root);
      resetStyle(this.canvas);

      this.root.style.position = "relative";
      this.root.style.cssFloat = "left";
      this.canvas.style.position = "absolute";
      this.canvas.style.left = "0";
      this.canvas.style.top = "0";
      this.canvas.width = 0;
      this.canvas.height = 0;

      this.root.appendChild(this.canvas);
      container.appendChild(this.root);

      // Also updates the canvas size
      this.viewportSize = options.viewportSize !== undefined ? options.viewportSize : "containerContent";

      const context: CanvasRenderingContext2D | null = this.canvas.getContext("2d");
      if (context === null) {
        throw new Incident("CanvasContextAcquisition", "Unable to acquire canvas context");
      }
      this.renderer = new CanvasRenderer(context);
      this.clock = options.clock !== undefined ? options.clock : SYSTEM_CLOCK;
      this.player = undefined;
    } catch (err) {
      Reflect.deleteProperty(container, "domuPlayer");
      throw err;
    }
  }

  setMovieUrl(movieUrl: string) {
    if (this.player !== undefined) {
      this.player.destroy();
    }
    this.player = startPlayer({
      movieUrl,
      clock: this.clock,
      renderer: this.renderer,
    });
  }

  /**
   * Called when the size of the viewport _may_ have been updated.
   */
  private handleViewportResize(newSize: Dimensions) {
    const {width, height} = newSize;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }
}

export function createDomuPlayer(options: DomuPlayerOptions): DomuPlayer {
  return new DomuPlayer(options);
}
