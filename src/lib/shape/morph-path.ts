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
  readonly startControlX: number;
  readonly startControlY: number;
  readonly startEndX: number;
  readonly startEndY: number;
  readonly endControlX: number;
  readonly endControlY: number;
  readonly endEndX: number;
  readonly endEndY: number;
}

export interface MorphLineTo {
  readonly type: MorphCommandType.LineTo;
  readonly startEndX: number;
  readonly startEndY: number;
  readonly endEndX: number;
  readonly endEndY: number;
}

export interface MorphMoveTo {
  readonly type: MorphCommandType.MoveTo;
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
}

export type MorphCommand = MorphCurveTo | MorphLineTo | MorphMoveTo;

export interface MorphPath {
  readonly commands: MorphCommand[];
  readonly fill?: MorphFillStyle;
  readonly line?: MorphLineStyle;
}
