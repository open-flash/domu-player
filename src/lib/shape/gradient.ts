import { StraightSRgba } from "semantic-types";
import { ColorSpace } from "swf-tree/color-space";
import { GradientSpread } from "swf-tree/gradient-spread";

export interface Gradient {
  readonly spread: GradientSpread;
  readonly colorSpace: ColorSpace;
  readonly colors: ColorStop[];
}

export interface ColorStop {
  readonly ratio: number;
  readonly color: Readonly<StraightSRgba<number>>;
}
