import {FillStyle} from "./fill-style";
import {LineStyle} from "./line-style";

export enum CommandType {
  LineTo,
  CurveTo,
  MoveTo,
}

export interface CurveTo {
  readonly type: CommandType.CurveTo;
  readonly controlX: number;
  readonly controlY: number;
  readonly endX: number;
  readonly endY: number;
}

export interface LineTo {
  readonly type: CommandType.LineTo;
  readonly endX: number;
  readonly endY: number;
}

export interface MoveTo {
  readonly type: CommandType.MoveTo;
  readonly x: number;
  readonly y: number;
}

export type Command = CurveTo | LineTo | MoveTo;

export interface Path {
  readonly commands: Command[];
  readonly fill?: FillStyle;
  readonly line?: LineStyle;
}
