import { StraightSRgba } from "semantic-types";

/**
 * Represents a valid CSS color such as `"rgba(200, 13, 53, 0.5)"` or `"transparent"`.
 */
export type CssColor = string;

/**
 * Converts a normalized color a css color
 */
export function fromNormalizedColor(color: StraightSRgba<number>): CssColor {
  return `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${color.a})`;
}
