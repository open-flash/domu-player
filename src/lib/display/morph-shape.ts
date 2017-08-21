import { Matrix } from "swf-tree/matrix";
import { MorphShapeCharacter } from "./character";
import { DisplayObject } from "./display-object";
import { DisplayObjectVisitor } from "./display-object-visitor";

export class MorphShape extends DisplayObject {
  readonly character: MorphShapeCharacter;
  ratio: number;
  matrix?: Matrix;

  constructor(character: MorphShapeCharacter) {
    super();
    this.character = character;
    this.ratio = 0;
  }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {
  }

  visit<R>(visitor: DisplayObjectVisitor<R>): R {
    return visitor.visitMorphShape(this);
  }
}
