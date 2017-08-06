import {StraightSRgba} from "semantic-types";

export enum FillStyleType {
  Solid,
}

export interface SolidFill {
  readonly type: FillStyleType.Solid;
  /**
   * Normalized colors, in the range [0, 1]
   */
  readonly color: Readonly<StraightSRgba<number>>;
}

export type FillStyle = SolidFill;
