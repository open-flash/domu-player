import { DisplayObjectType } from "swf-renderer/display/display-object-type";
import { MorphShape as RendererMorphShape } from "swf-renderer/display/morph-shape";
import { Matrix } from "swf-tree/matrix";
import { DefineMorphShape } from "swf-tree/tags";
import { MorphShapeCharacter } from "./character";
import { DisplayObjectBase } from "./display-object-base";
import { DisplayObjectVisitor } from "./display-object-visitor";

export class MorphShape extends DisplayObjectBase implements RendererMorphShape {
  readonly type: DisplayObjectType.MorphShape;
  readonly character: MorphShapeCharacter;
  readonly definition: DefineMorphShape;
  ratio: number;
  matrix?: Matrix;

  constructor(character: MorphShapeCharacter) {
    super();
    this.type = DisplayObjectType.MorphShape;
    this.character = character;
    this.definition = character.definition;
    this.ratio = 0;
  }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {
  }

  visit<R>(visitor: DisplayObjectVisitor<R>): R {
    return visitor.visitMorphShape(this);
  }
}
