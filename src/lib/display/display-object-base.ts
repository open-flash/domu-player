import { DisplayObjectInterface } from "../types/display-object";
import { DisplayObjectVisitor } from "./display-object-visitor";

const INITIAL_DEPTH: number = -1;

export abstract class DisplayObjectBase implements DisplayObjectInterface {
  depth?: number;

  constructor() {
    this.depth = undefined;
  }

  abstract nextFrame(isMainLoop: boolean, runScripts: boolean): void;

  abstract visit<R>(visitor: DisplayObjectVisitor<R>): R;
}
