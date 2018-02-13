import { Uint16 } from "semantic-types";
import { ButtonCondAction } from "swf-tree/buttons/button-cond-action";
import { ImageType } from "swf-tree/image-type";
import { TagType } from "swf-tree/tags/_type";
import { DefineBitmap } from "swf-tree/tags/define-bitmap";
import { DefineButton } from "swf-tree/tags/define-button";
import { PlaceObject } from "swf-tree/tags/place-object";
import { MorphPath } from "../shape/morph-path";
import { Path } from "../shape/path";
import { DefineSprite } from "swf-tree/tags/define-sprite";
import { SpriteTag } from "swf-tree/sprite-tag";

export enum CharacterType {
  Button,
  Bitmap,
  MorphShape,
  Shape,
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
  up: PlaceObject[];
  over: PlaceObject[];
  down: PlaceObject[];
  hitTest: PlaceObject[];
}

export interface ButtonCharacter {
  id: Uint16;
  type: CharacterType.Button;
  trackAsMenu: boolean;
  states: ButtonStates;
  actions: ButtonCondAction[];
}

export interface SpriteCharacter {
  id: Uint16;
  type: CharacterType.Sprite;
  frameCount: Uint16;
  tags: SpriteTag[];
}

export interface MorphShapeCharacter {
  id: Uint16;
  type: CharacterType.MorphShape;
  paths: MorphPath[];
}

export interface ShapeCharacter {
  id: Uint16;
  type: CharacterType.Shape;
  paths: Path[];
}

export type Character = BitmapCharacter | ButtonCharacter | MorphShapeCharacter | ShapeCharacter | SpriteCharacter;

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
      isMove: false,
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
    id: tag.buttonId,
    trackAsMenu: tag.trackAsMenu,
    states,
    actions: tag.actions,
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

export function createSpriteCharacter(tag: DefineSprite): SpriteCharacter {
  return {
    type: CharacterType.Sprite,
    id: tag.id,
    frameCount: tag.frameCount,
    tags: tag.tags,
  };
}
