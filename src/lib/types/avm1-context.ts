import { AvmObject } from "avmore/avm-value";
import { Vm } from "avmore/vm";
import { DomuPlayerHost } from "../avm/avm";
import { Sprite } from "../display/sprite";

export interface Avm1Context {
  readonly vm: Vm;
  readonly host: DomuPlayerHost;

  spriteToAvm(sprite: Sprite): AvmObject;
}
