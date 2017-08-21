import { Incident } from "incident";
import { Uint16 } from "semantic-types";
import { Movie as SwfMovie } from "swf-tree/movie";
import { TagType } from "swf-tree/tags/_type";
import { PlaceObject as PlaceObjectSwfTag } from "swf-tree/tags/place-object";
import { decodeSwfMorphShape } from "../shape/decode-swf-morph-shape";
import { decodeSwfShape } from "../shape/decode-swf-shape";
import { Character, CharacterDictionary, CharacterType, SpriteCharacter } from "./character";
import { DisplayObject } from "./display-object";
import { DisplayObjectContainer } from "./display-object-container";
import { DisplayObjectVisitor } from "./display-object-visitor";
import { collectFrames, Frame } from "./frame";
import { MorphShape } from "./morph-shape";
import { Shape } from "./shape";

export type CharacterRef = {root: true} | {root: false; id: Uint16};

export interface Sprite extends DisplayObjectContainer {
  readonly character: CharacterRef;
}

export abstract class AbstractSprite extends DisplayObjectContainer implements Sprite {
  public readonly character: CharacterRef;

  // private readonly dictionary: CharacterDictionary;

  constructor(character: CharacterRef/* dictionary: CharacterDictionary */) {
    super();
    this.character = character;
  }

  // processTags(tags: SwfTag[], backward: boolean): void {
  //   if (backward) {
  //     throw new Incident("NotImplemented", "Sprite#processTags(backwards = true)");
  //   }
  //   for (const tag of tags) {
  //     switch (tag.type) {
  //       case SwfTagType.PlaceObject:
  //         this.processPlaceObjectTag(tag);
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {
    console.warn("NotImplemented");
  }

  visit<R>(visitor: DisplayObjectVisitor<R>): R {
    return visitor.visitSprite(this);
  }

  // private processPlaceObjectTag(tag: PlaceObjectSwfTag): void {
  //   console.log(tag);
  //   if (tag.characterId !== undefined) {
  //     const character: Character | undefined = this.dictionary.getCharacterById();
  //     if (character === undefined) {
  //       console.warn(`Unknown character for id: ${tag.characterId}`);
  //       return;
  //     }
  //   }
  // }
}

/**
 * Corresponds to the tags at the root of SWF file
 */
export class RootSprite extends AbstractSprite {
  readonly characterDictionary: CharacterDictionary;
  readonly frameCount: Uint16;

  // Note: this frame 0-indexed (the frames used by the actions are 1-indexed, ex: MovieClip::currentFrame);
  currentFrameIndex: number;

  private readonly frames: Frame[];

  constructor(movie: SwfMovie) {
    super({root: true});
    this.characterDictionary = new CharacterDictionary();
    this.frameCount = movie.header.frameCount;
    this.frames = [];
    this.currentFrameIndex = -1;

    for (const frame of collectFrames(movie.tags)) {
      this.addFrame(frame);
    }
  }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {
    this.currentFrameIndex++;
    if (this.currentFrameIndex >= this.frameCount) {
      this.currentFrameIndex = 0;
    }
    if (this.currentFrameIndex >= this.frames.length) {
      return;
    }
    const frame: Frame = this.frames[this.currentFrameIndex];
    for (const tag of frame.tags) {
      switch (tag.type) {
        case TagType.DefineMorphShape:
          this.characterDictionary.setCharacter(tag.id, decodeSwfMorphShape(tag));
          break;
        case TagType.DefineShape:
          this.characterDictionary.setCharacter(tag.id, decodeSwfShape(tag));
          break;
        case TagType.PlaceObject:
          if (tag.characterId !== undefined) {
            const character: Character | undefined = this.characterDictionary.getCharacterById(tag.characterId);
            if (character === undefined) {
              console.warn(`Unknown character id: ${tag.characterId}`);
              break;
            }
            this.placeObject(tag, character);
          } else {
            if (tag.depth === undefined) {
              console.warn("Expected depth to be defined");
              break;
            }
            const displayObject: DisplayObject | undefined = this.getChildAtDepth(tag.depth);
            if (displayObject === undefined) {
              console.warn(`DisplayObject not found at depth: ${tag.depth}`);
              break;
            }
            if (tag.matrix !== undefined) {
              (displayObject as MorphShape).matrix = tag.matrix;
            }
            (displayObject as MorphShape).ratio = tag.ratio === undefined ? 0 : tag.ratio / (1 << 16);
            break;
          }
          break;
        case TagType.SetBackgroundColor:
        case TagType.FileAttributes:
        case TagType.Metadata:
        case TagType.ShowFrame:
          break;
        default:
          console.warn(`Unsupported tag type (${TagType[tag.type]}) for the following tag:`);
          console.warn(tag);
          break;
      }
    }
  }

  private placeObject(tag: PlaceObjectSwfTag, character: Character): void {
    if (this.getChildAtDepth(tag.depth) !== undefined) {
      return;
    }
    switch (character.type) {
      case CharacterType.MorphShape:
        const morphShape: MorphShape = new MorphShape(character);
        morphShape.ratio = tag.ratio === undefined ? 0 : tag.ratio / (1 << 16);
        morphShape.matrix = tag.matrix;
        this.addChildAtDepth(morphShape, tag.depth);
        break;
      case CharacterType.Shape:
        const shape: Shape = new Shape(character);
        this.addChildAtDepth(shape, tag.depth);
        console.log("Placed object");
        break;
      default:
        console.warn(`Unknown character type: ${(character as any).type}`);
        break;
    }
  }

  private addFrame(frame: Frame) {
    this.frames.push(frame);
  }
}

/**
 * Instance of a sprite defined with the defineSprite tag
 */
export class ChildSprite extends AbstractSprite {
  constructor(character: SpriteCharacter) {
    super({root: false, id: character.id});
  }
}
