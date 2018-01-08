import {MorphShape} from "../shape/morph-shape";
import {Shape} from "../shape/shape";

export interface Renderer {
  clear(): void;

  drawMorphShape(shape: MorphShape, ratio: number): void;

  drawShape(shape: Shape): void;
}

// export interface RendererFactory<R extends Renderer = Renderer> {
//   create(width: number, height: number): R;
// }
