import {StraightSRgba, Uint16} from "semantic-types";
import {Tag, TagType} from "swf-tree";
import {Matrix} from "swf-tree/matrix";
import {Movie} from "swf-tree/movie";
import {fromNormalizedColor} from "../lib/css-color";
import {CanvasRenderer} from "../lib/renderers/canvas-renderer";
import {Renderer} from "../lib/renderers/renderer";
import {CharacterType} from "../lib/shape/character-type";
import {decodeSwfMorphShape} from "../lib/shape/decode-swf-morph-shape";
import {decodeSwfShape} from "../lib/shape/decode-swf-shape";
import {MorphShape} from "../lib/shape/morph-shape";
import {Shape} from "../lib/shape/shape";
import {getMovie} from "./xhr-loader";

export type Character = Shape | MorphShape;

export interface ShapeInstance {
  type: CharacterType.Shape;
  shape: Shape;
}

export interface MorphShapeInstance {
  type: CharacterType.MorphShape;
  shape: MorphShape;
  matrix?: Matrix;
  ratio: number;
}

export type CharacterInstance = ShapeInstance | MorphShapeInstance;

interface FrameTree {
  instances: Map<number, CharacterInstance>;
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

  private splitTagsByFrame(tags: Iterable<Tag>): Tag[][] {
    const result: Tag[][] = [];
    let cur: Tag[] = [];
    for (const tag of tags) {
      cur.push(tag);
      if (tag.type === TagType.ShowFrame) {
        result.push(cur);
        cur = [];
      }
    }
    if (cur.length !== 0) {
      result.push(cur);
    }
    return result;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  private async play(movie: Movie): Promise<never> {
    while (true) {
      for (const tags of this.splitTagsByFrame(movie.tags)) {
        this.applyTags(tags);
        await this.delay(1000 / movie.header.frameRate.valueOf());
      }
    }
  }

  private load(): void {
    getMovie(this.movieUri).then((movie) => {
      this.play(movie);
    });
  }

  private applyTags(tags: Iterable<Tag>): void {
    for (const tag of tags) {
      this.applyTag(tag);
    }
  }

  private applyTag(tag: Tag): void {
    switch (tag.type) {
      case TagType.DefineMorphShape:
        this.dictionary.set(tag.id, decodeSwfMorphShape(tag));
        break;
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
        if (tag.characterId !== undefined) {
          const character: Character | undefined = this.dictionary.get(tag.characterId);
          if (character === undefined) {
            console.warn(`Unknown character id: ${tag.characterId}`);
            break;
          }
          switch (character.type) {
            case CharacterType.MorphShape:
              this.frameTree.instances.set(
                tag.depth,
                {
                  type: CharacterType.MorphShape,
                  shape: character,
                  matrix: tag.matrix,
                  ratio: tag.ratio === undefined ? 0 : tag.ratio / (1 << 16),
                },
              );
              break;
            case CharacterType.Shape:
              this.frameTree.instances.set(tag.depth, {type: CharacterType.Shape, shape: character});
              break;
            default:
              console.warn(`Unknown character type: ${(character as any).type}`);
              break;
          }
        } else {
          if (tag.depth === undefined) {
            console.warn("Expected depth to be defined");
            break;
          }
          const instance: CharacterInstance | undefined = this.frameTree.instances.get(tag.depth);
          if (instance === undefined) {
            console.warn(`Instance not found at depth: ${tag.depth}`);
            break;
          }
          if (tag.matrix !== undefined) {
            (instance as MorphShapeInstance).matrix = tag.matrix;
          }
          (instance as MorphShapeInstance).ratio = tag.ratio === undefined ? 0 : tag.ratio / (1 << 16);
          break;
        }
        break;
      case TagType.SetBackgroundColor:
        this.setBackgroundColor({r: tag.color.r / 255, g: tag.color.g / 255, b: tag.color.b / 255, a: 1});
        break;
      case TagType.ShowFrame:
        this.renderer.clear();
        for (const [depth, instance] of this.frameTree.instances) {
          switch (instance.type) {
            case CharacterType.MorphShape:
              this.renderer.drawMorphShape(instance.shape, instance.ratio, instance.matrix);
              break;
            case CharacterType.Shape:
              this.renderer.drawShape(instance.shape);
              break;
            default:
              console.warn(`Unknown instance type: ${(instance as any).type}`);
              break;
          }
        }
        break;
      default:
        console.warn(`Unsupported tag type (${TagType[tag.type]}) for the following tag:`);
        console.warn(tag);
    }
  }
}

export function createPlayer(container: HTMLDivElement, movieUri: string): DomuPlayer {
  return new DomuPlayer(container, movieUri);
}
