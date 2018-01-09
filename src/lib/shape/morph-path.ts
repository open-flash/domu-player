import {FillStyle} from "./fill-style";
import {LineStyle} from "./line-style";
import {MorphLineStyle} from "./morph-line-style";
import {MorphFillStyle} from "./morph-fill-style";

export enum MorphCommandType {
  LineTo,
  CurveTo,
  MoveTo,
}

export interface MorphCurveTo {
  readonly type: MorphCommandType.CurveTo;
  readonly controlX: [number, number];
  readonly controlY: [number, number];
  readonly endX: [number, number];
  readonly endY: [number, number];
}

export interface MorphLineTo {
  readonly type: MorphCommandType.LineTo;
  readonly endX: [number, number];
  readonly endY: [number, number];
}

export interface MorphMoveTo {
  readonly type: MorphCommandType.MoveTo;
  readonly x: [number, number];
  readonly y: [number, number];
}

export type MorphCommand = MorphCurveTo | MorphLineTo | MorphMoveTo;

export interface MorphPath {
  readonly commands: MorphCommand[];
  readonly fill?: MorphFillStyle;
  readonly line?: MorphLineStyle;
}
