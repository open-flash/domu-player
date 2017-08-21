import {MorphShape} from "../shape/morph-shape";
import {Shape} from "../shape/shape";
import {Matrix} from "swf-tree/matrix";
import { Stage } from "../display/stage";

export interface Renderer {
  render(stage: Stage): void;

  // clear(): void;
  //
  // drawMorphShape(shape: MorphShape, ratio: number, matrix?: Matrix): void;
  //
  // drawShape(shape: Shape): void;
}

// export interface RendererFactory<R extends Renderer = Renderer> {
//   create(width: number, height: number): R;
// }
