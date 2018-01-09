import {MorphShape} from "../shape/morph-shape";
import {Shape} from "../shape/shape";
import {Matrix} from "swf-tree/matrix";

export interface Renderer {
  clear(): void;

  drawMorphShape(shape: MorphShape, ratio: number, matrix?: Matrix): void;

  drawShape(shape: Shape): void;
}

// export interface RendererFactory<R extends Renderer = Renderer> {
//   create(width: number, height: number): R;
// }
