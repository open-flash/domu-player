import {Shape} from "../shape/shape";

export interface Renderer {
  clear(): void;

  drawShape(shape: Shape): void;
}

// export interface RendererFactory<R extends Renderer = Renderer> {
//   create(width: number, height: number): R;
// }
