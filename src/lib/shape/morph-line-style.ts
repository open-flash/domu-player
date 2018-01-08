import {StraightSRgba} from "semantic-types";

export enum MorphLineStyleType {
  Solid,
}

export interface MorphSolidLine {
  readonly type: MorphLineStyleType.Solid;
  readonly startColor: Readonly<StraightSRgba<number>>;
  readonly endColor: Readonly<StraightSRgba<number>>;
  readonly width: number;
}

export type MorphLineStyle = MorphSolidLine;
