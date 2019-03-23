import { Sprite } from "../display/sprite";

export interface Avm1Context {
  executeActions(target: Sprite, actions: Uint8Array): void;
}
