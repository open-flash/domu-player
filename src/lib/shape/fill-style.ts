import { StraightSRgba, Uint16 } from "semantic-types";
import { Matrix } from "swf-tree/matrix";
import { Gradient } from "./gradient";

export enum FillStyleType {
  Bitmap,
  FocalGradient,
  LinearGradient,
  Solid,
}

export interface BitmapFill {
  readonly type: FillStyleType.Bitmap;

  readonly bitmapId: Uint16;

  readonly matrix: Matrix;

  readonly repeating: boolean;

  readonly smoothed: boolean;
}

export interface FocalGradientFill {
  readonly type: FillStyleType.FocalGradient;

  readonly matrix: Matrix;

  readonly gradient: Gradient;

  /**
   * Focal point left-right position in the [-1, 1] inclusive range.
   * `-1` means the focal point is on the left side, `0` is the center and `1` is the right.
   */
  readonly focalPoint: number;
}

export interface LinearGradientFill {
  readonly type: FillStyleType.LinearGradient;

  readonly matrix: Matrix;

  readonly gradient: Gradient;
}

export interface SolidFill {
  readonly type: FillStyleType.Solid;
  /**
   * Normalized colors, in the range [0, 1]
   */
  readonly color: Readonly<StraightSRgba<number>>;
}

export type FillStyle = BitmapFill | FocalGradientFill | LinearGradientFill | SolidFill;
