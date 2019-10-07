import { Uint16 } from "semantic-types";
import { ButtonCondAction } from "swf-tree/button/button-cond-action";
import { ImageType } from "swf-tree/image-type";
import { SpriteTag } from "swf-tree/sprite-tag";
import { DefineSound } from "swf-tree/tags";
import { TagType } from "swf-tree/tags/_type";
import { DefineBitmap } from "swf-tree/tags/define-bitmap";
import { DefineButton } from "swf-tree/tags/define-button";
import { DefineMorphShape } from "swf-tree/tags/define-morph-shape";
import { DefineShape } from "swf-tree/tags/define-shape";
import { DefineSprite } from "swf-tree/tags/define-sprite";
import { PlaceObject } from "swf-tree/tags/place-object";
import { SwfAudioContext } from "../audio/swf-audio-context";

export enum CharacterType {
  Button,
  Bitmap,
  MorphShape,
  Shape,
  Sound,
  Sprite,
}

export class CharacterDictionary {
  private readonly characters: Map<Uint16, Character>;

  constructor() {
    this.characters = new Map();
  }

  getCharacterById(characterId: Uint16): Character | undefined {
    return this.characters.get(characterId);
  }

  setCharacter(characterId: Uint16, character: Character): void {
    // TODO: Assert unique
    this.characters.set(characterId, character);
  }
}

export interface BitmapCharacter {
  id: Uint16;
  type: CharacterType.Bitmap;
  width: number;
  height: number;
  mediaType: ImageType;
  data: Uint8Array;
}

/**
 * You should place all the corresponding sprites when the button is in a given state
 */
export interface ButtonStates {
  readonly up: PlaceObject[];
  readonly over: PlaceObject[];
  readonly down: PlaceObject[];
  readonly hitTest: PlaceObject[];
}

export interface ButtonCharacter {
  readonly id: Uint16;
  readonly type: CharacterType.Button;
  readonly trackAsMenu: boolean;
  readonly states: ButtonStates;
  readonly actions: ReadonlyArray<ButtonCondAction>;
}

export interface SpriteCharacter {
  readonly id: Uint16;
  readonly type: CharacterType.Sprite;
  readonly frameCount: Uint16;
  readonly tags: ReadonlyArray<SpriteTag>;
}

// TODO: Use `DefineMorphShape` directly instead of wrapping it in `MorphShapeCharacter`
export interface MorphShapeCharacter {
  readonly id: Uint16;
  readonly type: CharacterType.MorphShape;
  readonly definition: DefineMorphShape;
}

// TODO: Use `DefineShape` directly instead of wrapping it in `ShapeCharacter`
export interface ShapeCharacter {
  readonly id: Uint16;
  readonly type: CharacterType.Shape;
  readonly definition: DefineShape;
}

export interface SoundCharacter {
  readonly id: Uint16;
  readonly type: CharacterType.Sound;
  readonly definition: DefineSound;
  readonly soundId: number;
}

export type Character =
  BitmapCharacter | ButtonCharacter | MorphShapeCharacter | ShapeCharacter | SoundCharacter | SpriteCharacter;

// TODO: Avoid creating tags at this point? (create them only if needed when instantiating the button)
export function createButtonCharacter(tag: DefineButton): ButtonCharacter {
  // Shumway ignores states referencing unknown characters (we just accept them at the moment)
  const states: ButtonStates = {
    up: [],
    down: [],
    over: [],
    hitTest: [],
  };

  for (const buttonRecord of tag.characters) {
    // TODO: Blend mode and filters
    const command: PlaceObject = {
      type: TagType.PlaceObject,
      isUpdate: false,
      depth: buttonRecord.depth,
      characterId: buttonRecord.characterId,
      matrix: buttonRecord.matrix,
      colorTransform: buttonRecord.colorTransform,
      filters: buttonRecord.filters,
      blendMode: buttonRecord.blendMode,
    };

    if (buttonRecord.stateUp) {
      states.up.push(command);
    }
    if (buttonRecord.stateDown) {
      states.down.push(command);
    }
    if (buttonRecord.stateOver) {
      states.over.push(command);
    }
    if (buttonRecord.stateHitTest) {
      states.hitTest.push(command);
    }
  }

  return {
    type: CharacterType.Button,
    id: tag.id,
    trackAsMenu: tag.trackAsMenu,
    states,
    actions: tag.actions,
  };
}

export function createMorphShapeCharacter(tag: DefineMorphShape): MorphShapeCharacter {
  return {
    type: CharacterType.MorphShape,
    id: tag.id,
    definition: tag,
  };
}

export function createBitmapCharacter(tag: DefineBitmap): BitmapCharacter {
  return {
    type: CharacterType.Bitmap,
    id: tag.id,
    width: tag.width,
    height: tag.height,
    mediaType: tag.mediaType,
    data: tag.data,
  };
}

export function createShapeCharacter(tag: DefineShape): ShapeCharacter {
  return {
    type: CharacterType.Shape,
    id: tag.id,
    definition: tag,
  };
}

export function createSoundCharacter(ctx: SwfAudioContext, tag: DefineSound): SoundCharacter {
  const soundId: number = ctx.addSound(tag);

  return {
    type: CharacterType.Sound,
    id: tag.id,
    definition: tag,
    soundId,
  };
}

export function createSpriteCharacter(tag: DefineSprite): SpriteCharacter {
  return {
    type: CharacterType.Sprite,
    id: tag.id,
    frameCount: tag.frameCount,
    tags: tag.tags,
  };
}
