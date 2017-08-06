// import {getMovie} from "./xhr-loader";

import {StraightSRgba, Uint16} from "semantic-types";
import {fromNormalizedColor} from "../lib/css-color";
import {getMovie} from "./xhr-loader";
import {Tag, TagType} from "swf-tree";
import {decodeSwfShape} from "../lib/shape/decode-swf-shape";
import {Shape} from "../lib/shape/shape";
import {Renderer} from "../lib/renderers/renderer";
import {CanvasRenderer} from "../lib/renderers/canvas-renderer";

export type Character = any;
export type CharacterInstance = any;

interface FrameTree {
  instances: Map<number, CharacterInstance>;
}

interface ShapeInstance {
  shape: Shape;
}

/**
 * Encapsulates an abstract player in a DOM <div> element
 */
export class DomuPlayer {
  private readonly container: HTMLDivElement;
  private readonly movieUri: string;
  private readonly root: HTMLDivElement;
  private readonly dictionary: Map<Uint16, Character>;
  private readonly frameTree: FrameTree;
  private readonly renderer: Renderer;

  constructor(container: HTMLDivElement, movieUri: string) {
    this.container = container;
    this.movieUri = movieUri;
    this.frameTree = {instances: new Map()};
    this.dictionary = new Map();

    // this.root = container.attachShadow({ mode: "open" });
    this.root = document.createElement("div");
    this.container.appendChild(this.root);
    this.renderer = this.createRenderer();

    this.load();
  }

  private createRenderer(): Renderer {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (context === null) {
      throw new Error("Unable to initialize canvas renderer");
    }
    let [width, height] = this.getContainerSize();
    if (width === 0 || height === 0) {
      width = 240;
      height = 200;
    }
    canvas.width = width;
    canvas.height = height;
    this.root.appendChild(canvas);
    return new CanvasRenderer(context, width, height);
  }

  private getContainerSize(): [number, number] {
    return [this.container.clientWidth, this.container.clientHeight];
  }

  private setBackgroundColor(color: StraightSRgba): void {
    this.root.style.backgroundColor = fromNormalizedColor(color);
  }

  private load(): void {
    getMovie(this.movieUri).then((movie) => {
      console.log(movie);
      this.applyTags(movie.tags);
    });
  }

  private applyTags(tags: Iterable<Tag>): void {
    for (const tag of tags) {
      this.applyTag(tag);
    }
  }

  private applyTag(tag: Tag): void {
    switch (tag.type) {
      case TagType.DefineShape:
        this.dictionary.set(tag.id, decodeSwfShape(tag));
        break;
      case TagType.FileAttributes:
        console.log("File attributes:");
        console.log(tag);
        break;
      case TagType.Metadata:
        break;
      case TagType.PlaceObject:
        const character: Character = this.dictionary.get(tag.characterId!)!;
        this.frameTree.instances.set(tag.depth, {shape: character});
        break;
      case TagType.ShowFrame:
        this.renderer.clear();
        for (const [depth, instance] of this.frameTree.instances) {
          this.renderer.drawShape(instance.shape);
        }
        break;
      case TagType.SetBackgroundColor:
        this.setBackgroundColor({r: tag.color.r / 255, g: tag.color.g / 255, b: tag.color.b / 255, a: 1});
        break;
      default:
        console.warn("Unsupported tag:");
        console.warn(tag);
    }
  }
}

export function createPlayer(container: HTMLDivElement, movieUri: string): DomuPlayer {
  return new DomuPlayer(container, movieUri);
}
