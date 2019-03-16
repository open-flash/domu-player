import { Uint16 } from "semantic-types";
import { Matrix } from "swf-tree/matrix";
import { Movie as SwfMovie } from "swf-tree/movie";
import { Tag } from "swf-tree/tag";
import { TagType } from "swf-tree/tags/_type";
import { PlaceObject as PlaceObjectSwfTag } from "swf-tree/tags/place-object";
import {
  Character,
  CharacterDictionary,
  CharacterType,
  createBitmapCharacter,
  createButtonCharacter, createMorphShapeCharacter, createShapeCharacter,
  createSpriteCharacter,
  SpriteCharacter,
} from "./character";
import { DisplayObjectBase } from "./display-object-base";
import { DisplayObjectContainer } from "./display-object-container";
import { DisplayObjectVisitor } from "./display-object-visitor";
import { collectFrames, Frame } from "./frame";
import { MorphShape } from "./morph-shape";
import { Shape } from "./shape";
import { SimpleButton } from "./simple-button";

export type CharacterRef = {root: true} | {root: false; id?: Uint16};

export interface Sprite extends DisplayObjectContainer {
  matrix?: Matrix;
  readonly character: CharacterRef;
}

export abstract class AbstractSprite extends DisplayObjectContainer implements Sprite {
  public readonly character: CharacterRef;

  protected readonly dictionary: CharacterDictionary;

  constructor(dictionary: CharacterDictionary, character: CharacterRef) {
    super();
    this.dictionary = dictionary;
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

  protected applyTag(tag: Tag): void {
    switch (tag.type) {
      case TagType.DefineButton:
        this.dictionary.setCharacter(tag.id, createButtonCharacter(tag));
        break;
      case TagType.DefineMorphShape:
        this.dictionary.setCharacter(tag.id, createMorphShapeCharacter(tag));
        break;
      case TagType.DefineBitmap:
        this.dictionary.setCharacter(tag.id, createBitmapCharacter(tag));
        break;
      case TagType.DefineShape:
        this.dictionary.setCharacter(tag.id, createShapeCharacter(tag));
        break;
      case TagType.DefineSprite:
        this.dictionary.setCharacter(tag.id, createSpriteCharacter(tag));
        break;
      case TagType.PlaceObject:
        if (tag.characterId !== undefined) {
          const character: Character | undefined = this.dictionary.getCharacterById(tag.characterId);
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
          const displayObject: DisplayObjectBase | undefined = this.getChildAtDepth(tag.depth);
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

  protected placeObject(tag: PlaceObjectSwfTag, character: Character): void {
    if (this.getChildAtDepth(tag.depth) !== undefined) {
      return;
    }
    switch (character.type) {
      case CharacterType.Button:
        const button: SimpleButton = SimpleButton.fromCharacter(character, this.dictionary);
        button.matrix = tag.matrix;
        this.addChildAtDepth(button, tag.depth);
        break;
      case CharacterType.MorphShape:
        const morphShape: MorphShape = new MorphShape(character);
        morphShape.ratio = tag.ratio === undefined ? 0 : tag.ratio / (1 << 16);
        morphShape.matrix = tag.matrix;
        this.addChildAtDepth(morphShape, tag.depth);
        break;
      case CharacterType.Shape:
        const shape: Shape = new Shape(character);
        shape.matrix = tag.matrix;
        this.addChildAtDepth(shape, tag.depth);
        break;
      case CharacterType.Sprite:
        const sprite: ChildSprite = ChildSprite.fromCharacter(character, this.dictionary);
        sprite.matrix = tag.matrix;
        this.addChildAtDepth(sprite, tag.depth);
        break;
      default:
        console.warn(`Unknown character type: ${(character as any).type}`);
        break;
    }
  }
}

/**
 * Corresponds to the tags at the root of SWF file
 */
export class RootSprite extends AbstractSprite {
  readonly frameCount: Uint16;

  // Note: this frame 0-indexed (the frames used by the actions are 1-indexed, ex: MovieClip::currentFrame);
  currentFrameIndex: number;

  private readonly frames: Frame[];

  constructor(movie: SwfMovie) {
    const dictionary: CharacterDictionary = new CharacterDictionary();
    super(dictionary, {root: true});
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
      this.applyTag(tag);
    }
    for (const child of this.children) {
      child.nextFrame(isMainLoop, runScripts);
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
  matrix?: Matrix;

  readonly frameCount: Uint16;

  // Note: this frame 0-indexed (the frames used by the actions are 1-indexed, ex: MovieClip::currentFrame);
  currentFrameIndex: number;

  private readonly frames: Frame[];

  private constructor(dictionary: CharacterDictionary, frames: Frame[], character: SpriteCharacter) {
    super(dictionary, {root: false, id: character.id});
    this.frameCount = frames.length;
    this.frames = frames;
    this.currentFrameIndex = -1;
  }

  static fromCharacter(character: SpriteCharacter, dictionary: CharacterDictionary): ChildSprite {
    const frames: Frame[] = [...collectFrames(character.tags)];
    return new ChildSprite(dictionary, frames, character);
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
      this.applyTag(tag);
    }
  }
}

/**
 * Instance of a sprite created dynamically (example: Action Script or button wrapper)
 */
export class DynamicSprite extends AbstractSprite {
  readonly frameCount: Uint16;

  // Note: this frame 0-indexed (the frames used by the actions are 1-indexed, ex: MovieClip::currentFrame);
  currentFrameIndex: number;

  private readonly frames: Frame[];

  constructor(dictionary: CharacterDictionary, frames: Frame[]) {
    super(dictionary, {root: false});
    this.frameCount = frames.length;
    this.frames = frames;
    this.currentFrameIndex = -1;
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
      this.applyTag(tag);
    }
  }
}
