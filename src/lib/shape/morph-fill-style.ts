import {StraightSRgba} from "semantic-types";

export enum MorphFillStyleType {
  Solid,
}

export interface MorphSolidFill {
  readonly type: MorphFillStyleType.Solid;
  /**
   * Normalized colors, in the range [0, 1]
   */
  readonly startColor: Readonly<StraightSRgba<number>>;
  readonly endColor: Readonly<StraightSRgba<number>>;
}

export type MorphFillStyle = MorphSolidFill;
