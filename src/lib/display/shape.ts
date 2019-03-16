import { DisplayObjectType } from "swf-renderer/display/display-object-type";
import { Shape as RendererShape } from "swf-renderer/display/shape";
import { Matrix } from "swf-tree/matrix";
import { DefineShape } from "swf-tree/tags";
import { ShapeCharacter } from "./character";
import { DisplayObjectBase } from "./display-object-base";
import { DisplayObjectVisitor } from "./display-object-visitor";

export class Shape extends DisplayObjectBase implements RendererShape {
  readonly type: DisplayObjectType.Shape;
  readonly character: ShapeCharacter;
  readonly definition: DefineShape;
  matrix?: Matrix;

  constructor(character: ShapeCharacter) {
    super();
    this.type = DisplayObjectType.Shape;
    this.character = character;
    this.definition = character.definition;
  }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {}

  visit<R>(visitor: DisplayObjectVisitor<R>): R {
    return visitor.visitShape(this);
  }
}
