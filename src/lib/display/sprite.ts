import { AvmObject } from "avmore/avm-value";
import { Avm1ScriptId } from "avmore/script";
import { TargetId } from "avmore/vm";
import { Uint16, UintSize } from "semantic-types";
import { Matrix } from "swf-tree/matrix";
import { Movie as SwfMovie } from "swf-tree/movie";
import { Tag } from "swf-tree/tag";
import { DoAction, FrameLabel, RemoveObject } from "swf-tree/tags";
import { TagType } from "swf-tree/tags/_type";
import { PlaceObject as PlaceObjectSwfTag } from "swf-tree/tags/place-object";
import { SwfAudioContext } from "../audio/swf-audio-context";
import { createAvm1Context } from "../avm/avm";
import { Avm1Context } from "../types/avm1-context";
import { ControlTag } from "../types/control-tag";
import {
  Character,
  CharacterDictionary,
  CharacterType,
  createBitmapCharacter,
  createButtonCharacter,
  createMorphShapeCharacter,
  createShapeCharacter,
  createSoundCharacter,
  createSpriteCharacter,
  SpriteCharacter,
} from "./character";
import { DisplayObject } from "./display-object";
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
  readonly namedChildren: Map<string, Sprite>;

  /**
   * @param frame Frame index (0-index or 1-index?) or frame label
   */
  gotoAndPlay(frame: number | string): void;

  /**
   * Play from current frame.
   */
  play(): void;

  /**
   * Stop playback.
   */
  stop(): void;

  /**
   * Returns the number of loaded frames and total frames.
   */
  getFrameLoadingProgress(): {loaded: UintSize; total: UintSize};

  /**
   * Sets the next frame.
   */
  gotoFrame(frameIndex: UintSize): void;
}

export abstract class AbstractSprite extends DisplayObjectContainer implements Sprite {
  public readonly character: CharacterRef;
  public readonly namedChildren: Map<string, Sprite>;

  /**
   * From name to 0-based frame index
   */
  public readonly frameLabels: Map<string, number>;

  protected readonly dictionary: CharacterDictionary;
  protected stopped: boolean;

  protected readonly frames: Frame[];

  /**
   * 0-indexed current frame
   *
   * Note: the Flash API exposes these frames as 1-indexed (e.g. `MovieClip#currentFrame`).
   */
  protected currentFrameIndex: number;

  /**
   * 0-indexed next frame (or null to use the default `currentFrameIndex + 1`)
   */
  protected nextFrameIndex: number | null;

  private readonly avm1Ctx: Avm1Context;
  private readonly audioCtx: SwfAudioContext;

  protected constructor(
    dictionary: CharacterDictionary,
    character: CharacterRef,
    avm1Ctx: Avm1Context,
    audioCtx: SwfAudioContext,
  ) {
    super();
    this.dictionary = dictionary;
    this.character = character;
    this.avm1Ctx = avm1Ctx;
    this.audioCtx = audioCtx;
    this.namedChildren = new Map();
    this.frameLabels = new Map();
    this.stopped = false;

    this.frames = [];
    this.currentFrameIndex = 0;
    this.nextFrameIndex = null;
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

  public nextFrame(isMainLoop: boolean, runScripts: boolean): void {
    console.warn("NotImplemented: Sprite#nextFrame");
  }

  public gotoAndPlay(frame: number | string): void {
    this.stopped = false;
    if (typeof frame === "string") {
      const frameIndex: number | undefined = this.frameLabels.get(frame);
      if (frameIndex === undefined) {
        throw new Error(`NotImplemented: UnknownFrameLabel: ${frame}`);
      }
      this.nextFrameIndex = frameIndex;
    } else {
      console.log("NotImplemented: Sprite#gotoAndPlay on non-string frame");
    }
  }

  public getFrameLoadingProgress(): {loaded: UintSize; total: UintSize} {
    const total: UintSize = this.frames.length;
    return {loaded: total, total};
  }

  public play(): void {
    this.stopped = false;
  }

  public gotoFrame(frameIndex: UintSize): void {
    this.nextFrameIndex = Math.max(Math.min(frameIndex, this.frames.length - 1), 0);
  }

  public stop(): void {
    this.stopped = true;
  }

  public visit<R>(visitor: DisplayObjectVisitor<R>): R {
    return visitor.visitSprite(this);
  }

  protected innerGotoFrame(frameIndex: number): void {
    if (frameIndex < 0 || frameIndex >= this.frames.length) {
      throw new RangeError(`FrameIndexOutOfRange: ${frameIndex}`);
    }

    // When going backward, we in fact replay the tags from the start and only keep the objects that
    // are placed.
    // We treat `frameIndex === this.currentFrameIndex` as a previous frame to handle single-frame
    // sprites. TODO: `return` in this case instead of re-rendering.
    const fromStart: boolean = frameIndex <= this.currentFrameIndex;
    const startIndex: UintSize = fromStart ? 0 : this.currentFrameIndex + 1;

    // Compute the tags that introduce differences between `startIndex` and `frameIndex`.
    // It is mainly about joining frames while removing `PlaceObject`/`RemoveObject` pairs that
    // cancel each-other.
    const deltaTags: ControlTag[] = [];

    const removedDepths: Set<UintSize> = new Set();
    for (let i: UintSize = frameIndex; i >= startIndex; i--) {
      const frame: Frame = this.frames[i];
      for (let j: UintSize = frame.controlTags.length - 1; j >= 0; j--) {
        const tag: ControlTag = frame.controlTags[j];
        if (removedDepths.has(tag.depth)) {
          continue;
        }
        if (tag.type === TagType.RemoveObject) {
          removedDepths.add(tag.depth);
          if (!fromStart) {
            // When playing from the start, all the objects are removed anyway, but when playing
            // from the current frame there might already be an object at the current depth and
            // we need to make sur to remove it.
            deltaTags.unshift(tag);
          }
        } else {
          deltaTags.unshift(tag);
        }
      }
    }

    this.execControlTags(deltaTags, fromStart);
    this.currentFrameIndex = frameIndex;
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
      case TagType.DefineSound:
        this.dictionary.setCharacter(tag.id, createSoundCharacter(this.audioCtx, tag));
        break;
      case TagType.DoAction:
        // Ignore during execution
        break;
      case TagType.DefineShape:
        this.dictionary.setCharacter(tag.id, createShapeCharacter(tag));
        break;
      case TagType.DefineSprite:
        this.dictionary.setCharacter(tag.id, createSpriteCharacter(tag));
        break;
      case TagType.FrameLabel:
        // Ignore during execution: Frame labels are probed while the sprite is loaded
        break;
      case TagType.PlaceObject:
        // Ignore during execution: handled by `execControlTags`
        break;
      case TagType.RemoveObject:
        // Ignore during execution: handled by `execControlTags`
        break;
      case TagType.SoundStreamHead:
        // TODO: Add support for `SoundStreamHead`
        break;
      case TagType.SetBackgroundColor:
      case TagType.FileAttributes:
      case TagType.Metadata:
      case TagType.ShowFrame:
        break;
      default:
        console.warn(`Unsupported tag type (${TagType[tag.type]})`);
        break;
    }
  }

  protected execDoAction(tag: DoAction): void {
    try {
      const targetId: TargetId = this.avm1Ctx.host.registerTarget(this.avm1Ctx.vm, this);
      const avmObj: AvmObject = this.avm1Ctx.spriteToAvm(this);
      const scriptId: Avm1ScriptId = this.avm1Ctx.vm.createAvm1Script(tag.actions, targetId, avmObj);
      this.avm1Ctx.vm.runToCompletion(scriptId, 1000);
    } catch (e) {
      console.warn(e);
    }
  }

  protected execPlaceObject(tag: PlaceObjectSwfTag): void {
    // console.log(tag);
    let displayObject: DisplayObject;
    const old: DisplayObjectBase | undefined = this.getChildAtDepth(tag.depth);
    if (tag.isUpdate) {
      if (old === undefined) {
        console.warn("PlaceObject: update=true but old is undefined");
        return;
      }
      if (tag.characterId === undefined) {
        displayObject = old as DisplayObject; // TODO: Remove type assertion
      } else {
        if (tag.characterId === (old as MorphShape).character.id) {
          // TODO: Check how to handle update with a defined character id matching the old character id
          //       (maybe it's a state reset?)
          displayObject = old as DisplayObject; // TODO: Remove type assertion
        } else {
          const character: Character | undefined = this.dictionary.getCharacterById(tag.characterId);
          if (character === undefined) {
            console.warn(`CharacterIdNotFound: ${tag.characterId}`);
            return;
          }
          switch (character.type) {
            case CharacterType.Button:
              displayObject = SimpleButton.fromCharacter(character, this.dictionary, this.avm1Ctx, this.audioCtx);
              break;
            case CharacterType.MorphShape:
              displayObject = new MorphShape(character);
              break;
            case CharacterType.Shape:
              displayObject = new Shape(character);
              break;
            case CharacterType.Sprite:
              displayObject = ChildSprite.fromCharacter(character, this.dictionary, this.avm1Ctx, this.audioCtx);
              break;
            default:
              console.warn(`UnknownCharacterType: ${(character as any).type}`);
              return;
          }
        }
      }
      if (tag.ratio !== undefined) {
        (displayObject as MorphShape).ratio = tag.ratio / (1 << 16);
      }
      if (tag.matrix !== undefined) {
        (displayObject as MorphShape).matrix = tag.matrix;
      }
      if (displayObject !== old) {
        this.setChildAtDepth(displayObject, tag.depth);
      }
    } else {
      if (tag.characterId === undefined) {
        console.warn("PlaceObject: update=false, characterId=undefined");
        return;
      }

      if (old !== undefined && tag.characterId === (old as MorphShape).character.id) {
        // console.log("Collision");
        return;
      }

      const character: Character | undefined = this.dictionary.getCharacterById(tag.characterId);
      if (character === undefined) {
        console.warn(`CharacterIdNotFound: ${tag.characterId}`);
        return;
      }
      switch (character.type) {
        case CharacterType.Button:
          displayObject = SimpleButton.fromCharacter(character, this.dictionary, this.avm1Ctx, this.audioCtx);
          break;
        case CharacterType.MorphShape:
          displayObject = new MorphShape(character);
          break;
        case CharacterType.Shape:
          displayObject = new Shape(character);
          break;
        case CharacterType.Sprite:
          displayObject = ChildSprite.fromCharacter(character, this.dictionary, this.avm1Ctx, this.audioCtx);
          break;
        default:
          console.warn(`UnknownCharacterType: ${(character as any).type}`);
          return;
      }
      if (tag.ratio !== undefined) {
        (displayObject as MorphShape).ratio = tag.ratio / (1 << 16);
      }
      if (tag.matrix !== undefined) {
        (displayObject as MorphShape).matrix = tag.matrix;
      }
      this.setChildAtDepth(displayObject, tag.depth);
    }

    if (tag.name !== undefined) {
      this.namedChildren.set(tag.name, displayObject as Sprite); // TODO: Remove type cast
      const selfObj: AvmObject = this.avm1Ctx.spriteToAvm(this);
      const childObj: AvmObject = this.avm1Ctx.spriteToAvm(displayObject as Sprite);
      const name: string = tag.name;
      this.avm1Ctx.vm.withContext(ctx => ctx.setStringMember(selfObj, name, childObj));
    }
  }

  protected execRemoveObject(tag: RemoveObject): void {
    // TODO: How to handle named sprites?
    this.removeChildAtDepth(tag.depth);
  }

  /**
   * Executes the provided control tags.
   *
   * @param tags Control tags to execute.
   * @param fromStart Boolean indicating that the control tags correspond to the start of the
   *                  timeline (otherwise from the current frame). If `true`, all the objects that
   *                  are not placed by the provided tags will be removed.
   */
  private execControlTags(tags: ReadonlyArray<ControlTag>, fromStart: boolean): void {
    const depthsToRemove: Set<UintSize> = new Set();
    if (fromStart) {
      for (const child of this.children) {
        if (child.depth !== undefined) {
          depthsToRemove.add(child.depth);
        }
      }
    }

    for (const tag of tags) {
      switch (tag.type) {
        case TagType.PlaceObject:
          this.execPlaceObject(tag);
          depthsToRemove.delete(tag.depth);
          break;
        case TagType.RemoveObject:
          this.execRemoveObject(tag);
          break;
        default:
          console.warn(`UnexpectedTagType (${TagType[(tag as any).type]})`);
          break;
      }
    }

    if (depthsToRemove.size > 0) {
      // If executing the control tags from the start, we need to remove the objects that were
      // there at the start and not placed.
      for (const depth of depthsToRemove) {
        this.removeChildAtDepth(depth);
      }
    }
  }
}

/**
 * Corresponds to the tags at the root of SWF file
 */
export class RootSprite extends AbstractSprite {
  readonly frameCount: Uint16;

  constructor(movie: SwfMovie) {
    const dictionary: CharacterDictionary = new CharacterDictionary();
    const avm1Ctx: Avm1Context = createAvm1Context();
    const audioCtx: SwfAudioContext = new SwfAudioContext();
    super(dictionary, {root: true}, avm1Ctx, audioCtx);
    this.frameCount = movie.header.frameCount;

    this.frames.length = 0;
    for (const frame of collectFrames(movie.tags)) {
      this.addFrame(frame);

      // Register definitions
      // TODO: Handle definitions more cleanly
      for (const tag of frame.tags) {
        this.applyTag(tag);
      }
    }
  }

  execFrameLabel(tag: FrameLabel): void {
    this.frameLabels.set(tag.name, this.currentFrameIndex);
  }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {
    if (!this.stopped) {
      const currentFrameIndex: UintSize = this.currentFrameIndex;
      const nextFrameIndex: UintSize = this.nextFrameIndex !== null
        ? this.nextFrameIndex
        : ((currentFrameIndex + 1) % this.frameCount);

      this.innerGotoFrame(nextFrameIndex);
      // `this.currentFrameIndex` is updated by `gotoFrame`.
      this.nextFrameIndex = null;
      const frame: Frame = this.frames[this.currentFrameIndex];
      for (const action of frame.actions) {
        this.execDoAction(action);
      }
    }
    for (const child of this.children) {
      child.nextFrame(isMainLoop, runScripts);
    }
  }

  private addFrame(frame: Frame) {
    const frameIndex: number = this.frames.length;
    this.frames.push(frame);
    for (const tag of frame.tags) {
      if (tag.type === TagType.FrameLabel) {
        this.frameLabels.set(tag.name, frameIndex);
      }
    }
  }
}

/**
 * Instance of a sprite defined with the defineSprite tag
 */
export class ChildSprite extends AbstractSprite {
  matrix?: Matrix;

  readonly frameCount: Uint16;

  private constructor(
    dictionary: CharacterDictionary,
    frames: Frame[],
    characterId: Uint16 | undefined,
    avm1Ctx: Avm1Context,
    audioCtx: SwfAudioContext,
  ) {
    super(dictionary, {root: false, id: characterId}, avm1Ctx, audioCtx);
    this.frameCount = frames.length;
    this.frames.splice(0, this.frames.length, ...frames);
    for (const [frameIndex, frame] of this.frames.entries()) {
      for (const tag of frame.tags) {
        if (tag.type === TagType.FrameLabel) {
          this.frameLabels.set(tag.name, frameIndex);
        }
      }
    }
    this.currentFrameIndex = -1;
  }

  static fromCharacter(
    character: SpriteCharacter,
    dictionary: CharacterDictionary,
    avm1Ctx: Avm1Context,
    audioCtx: SwfAudioContext,
  ): ChildSprite {
    const frames: Frame[] = [...collectFrames(character.tags)];
    return new ChildSprite(dictionary, frames, character.id, avm1Ctx, audioCtx);
  }

  static fromButtonState(
    tags: ReadonlyArray<Tag>,
    dictionary: CharacterDictionary,
    avm1Ctx: Avm1Context,
    audioCtx: SwfAudioContext,
  ): ChildSprite {
    const frames: Frame[] = [...collectFrames(tags)];
    return new ChildSprite(dictionary, frames, undefined, avm1Ctx, audioCtx);
  }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {
    if (!this.stopped) {
      const currentFrameIndex: UintSize = this.currentFrameIndex;
      const nextFrameIndex: UintSize = this.nextFrameIndex !== null
        ? this.nextFrameIndex
        : ((currentFrameIndex + 1) % this.frameCount);

      this.innerGotoFrame(nextFrameIndex);
      // `this.currentFrameIndex` is updated by `gotoFrame`.
      this.nextFrameIndex = null;
      const frame: Frame = this.frames[this.currentFrameIndex];
      for (const action of frame.actions) {
        this.execDoAction(action);
      }
    }
    for (const child of this.children) {
      child.nextFrame(isMainLoop, runScripts);
    }
  }
}

// /**
//  * Instance of a sprite created dynamically (example: Action Script or button wrapper)
//  */
// export class DynamicSprite extends AbstractSprite {
//   readonly frameCount: Uint16;
//
//   private readonly frames: Frame[];
//
//   constructor(dictionary: CharacterDictionary, frames: Frame[], avm1Ctx: Avm1Context) {
//     super(dictionary, {root: false}, avm1Ctx);
//     this.frameCount = frames.length;
//     this.frames = frames;
//     this.currentFrameIndex = -1;
//   }
//
//   execFrameLabel(tag: FrameLabel): void {
//     this.frameLabels.set(tag.name, this.currentFrameIndex);
//   }
//
//   nextFrame(isMainLoop: boolean, runScripts: boolean): void {
//     if (this.stopped) {
//       return;
//     }
//     this.currentFrameIndex++;
//     if (this.currentFrameIndex >= this.frameCount) {
//       this.currentFrameIndex = 0;
//     }
//     if (this.currentFrameIndex >= this.frames.length) {
//       return;
//     }
//     const frame: Frame = this.frames[this.currentFrameIndex];
//     for (const tag of frame.tags) {
//       this.applyTag(tag);
//     }
//   }
// }
