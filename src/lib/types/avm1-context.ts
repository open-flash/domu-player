import { AvmObject } from "avmore/avm-value";
import { Vm } from "avmore/vm";
import { DomuPlayerHost } from "../avm/avm";
import { MovieClipRealm } from "../avm/native/movie-clip";
import { Sprite } from "../display/sprite";

export interface Avm1Context {
  readonly vm: Vm;
  readonly host: DomuPlayerHost;
  readonly mcRealm: MovieClipRealm;

  spriteToAvm(sprite: Sprite): AvmObject;
}
