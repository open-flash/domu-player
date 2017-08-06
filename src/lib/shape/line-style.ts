import {StraightSRgba} from "semantic-types";

export enum LineStyleType {
  Solid,
}

export interface SolidLine {
  readonly type: LineStyleType.Solid;
  readonly color: Readonly<StraightSRgba<number>>;
  readonly width: number;
}

export type LineStyle = SolidLine;
