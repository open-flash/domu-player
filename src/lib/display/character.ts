import { Uint16 } from "semantic-types";
import { Tag } from "swf-tree/tag";
import { MorphPath } from "../shape/morph-path";
import { Path } from "../shape/path";

// export type Character = any;

export enum CharacterType {
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

export interface SpriteCharacter {
  id: Uint16;
  type: CharacterType.Sprite;
  frameCount: Uint16;
  tags: Tag[];
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

export type Character = MorphShapeCharacter | ShapeCharacter | SpriteCharacter;
