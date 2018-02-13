import { Matrix } from "swf-tree/matrix";
import { ShapeCharacter } from "./character";
import { DisplayObject } from "./display-object";
import { DisplayObjectVisitor } from "./display-object-visitor";

export class Shape extends DisplayObject {
  readonly character: ShapeCharacter;
  matrix?: Matrix;

  constructor(character: ShapeCharacter) {
    super();
    this.character = character;
  }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {}

  visit<R>(visitor: DisplayObjectVisitor<R>): R {
    return visitor.visitShape(this);
  }
}
