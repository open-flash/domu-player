import {CharacterType} from "./character-type";
import {MorphPath} from "./morph-path";

export interface MorphShape {
  type: CharacterType.MorphShape;
  paths: MorphPath[];
}
