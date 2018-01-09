import {UintSize} from "semantic-types";
import {
  MorphFillStyle as SwfMorphFillStyle, MorphFillStyleType as SwfMorphFillStyleType,
  MorphLineStyle as SwfMorphLineStyle, tags,
} from "swf-tree";
import {MorphShapeRecordType} from "swf-tree/morph-shape-records/_type";
import {MorphCurvedEdge} from "swf-tree/morph-shape-records/morph-curved-edge";
import {MorphStraightEdge} from "swf-tree/morph-shape-records/morph-straight-edge";
import {MorphStyleChange} from "swf-tree/morph-shape-records/morph-style-change";
import {normalizeStraightSRgba} from "./decode-swf-shape";
import {MorphFillStyle, MorphFillStyleType} from "./morph-fill-style";
import {MorphLineStyle, MorphLineStyleType} from "./morph-line-style";
import {MorphCommand, MorphCommandType, MorphPath} from "./morph-path";
import {MorphShape} from "./morph-shape";
import {Shape} from "./shape";
import {CharacterType} from "./character-type";

/**
 * Converts a space-optimized morph shape definition to a list of simpler paths for easier processing/rendering
 */
export function decodeSwfMorphShape(tag: tags.DefineMorphShape): MorphShape {
  const converter: SwfMorphShapeDecoder = new SwfMorphShapeDecoder(tag.shape.fillStyles, tag.shape.lineStyles);

  for (const record of tag.shape.records) {
    switch (record.type) {
      case MorphShapeRecordType.MorphCurvedEdge:
        converter.applyCurvedEdge(record);
        break;
      case MorphShapeRecordType.MorphStraightEdge:
        converter.applyStraightEdge(record);
        break;
      case MorphShapeRecordType.MorphStyleChange:
        converter.applyStyleChange(record);
        break;
    }
  }

  return converter.getShape();
}

enum SegmentType {
  Straight,
  Curved,
}

interface StraightSegment {
  type: SegmentType.Straight;
  startX: [number, number];
  startY: [number, number];
  endX: [number, number];
  endY: [number, number];
}

function createStraightSegment(
  startX: [number, number],
  startY: [number, number],
  endX: [number, number],
  endY: [number, number],
): StraightSegment {
  return {type: SegmentType.Straight, startX, startY, endX, endY};
}

interface CurvedSegment {
  type: SegmentType.Curved;
  startX: [number, number];
  startY: [number, number];
  controlX: [number, number];
  controlY: [number, number];
  endX: [number, number];
  endY: [number, number];
}

function createCurvedSegment(
  startX: [number, number],
  startY: [number, number],
  controlX: [number, number],
  controlY: [number, number],
  endX: [number, number],
  endY: [number, number],
): CurvedSegment {
  return {type: SegmentType.Curved, startX, startY, controlX, controlY, endX, endY};
}

/**
 * Represents the geometry of the path part produced by a single CurvedEdge or StraightEdge record.
 */
type Segment = StraightSegment | CurvedSegment;

/**
 * Normalize the fill style from the SWF format to the renderer format
 */
function decodeFillStyle(old: SwfMorphFillStyle): MorphFillStyle {
  switch (old.type) {
    case SwfMorphFillStyleType.Solid:
      return {
        type: MorphFillStyleType.Solid,
        startColor: normalizeStraightSRgba(old.startColor),
        endColor: normalizeStraightSRgba(old.endColor),
      };
    default:
      console.warn(old);
      throw new Error("Unknown fill type");
  }
}

/**
 * Normalize the line style from the SWF format to the renderer format
 */
function decodeLineStyle(old: SwfMorphLineStyle): MorphLineStyle {
  // TODO...
  return {
    type: MorphLineStyleType.Solid,
    startColor: {r: 0, g: 0, b: 0, a: 1},
    endColor: {r: 0, g: 0, b: 0, a: 1},
    width: [0, 1200],
  };
}

/**
 * Each change of style list creates a new records layer.
 * For each record group, the fills are rendered first, and then the strokes.
 */
interface StyleLayer {
  readonly fills: FillSegmentSet[];
  readonly lines: LineSegmentSet[];
}

/**
 * For a given fill style, the corresponding segments in their order of definition.
 */
interface FillSegmentSet {
  readonly style: MorphFillStyle;
  readonly segments: Segment[];
}

/**
 * For a given line style, the corresponding segments in their order of definition.
 */
interface LineSegmentSet {
  readonly style: MorphLineStyle;
  readonly segments: Segment[];
}

/**
 * Create a new layer with the supplied styles.
 */
function createStyleLayer(swfFillStyles: SwfMorphFillStyle[], swfLineStyles: SwfMorphLineStyle[]): StyleLayer {
  const fills: FillSegmentSet[] = [];
  for (const swfFillStyle of swfFillStyles) {
    fills.push({
      style: decodeFillStyle(swfFillStyle),
      segments: [],
    });
  }
  const lines: LineSegmentSet[] = [];
  for (const swfLineStyle of swfLineStyles) {
    lines.push({
      style: decodeLineStyle(swfLineStyle),
      segments: [],
    });
  }
  return {fills, lines};
}

/**
 * Extract a sequence of continuous segments, removes them from openSet.
 */
function extractContinuous(openSet: Segment[]): Segment[] {
  const first: Segment | undefined = openSet.shift();
  if (first === undefined) {
    throw new Error("FailedAssertion: openSet should not be empty");
  }
  const result: Segment[] = [first];
  let startX: UintSize = first.startX[0];
  let startY: UintSize = first.startY[0];
  let endX: UintSize = first.endX[0];
  let endY: UintSize = first.endY[0];
  for (let i: number = 0, len: number = openSet.length; i < len; i++) {
    const current: Segment = openSet[i];
    if (current.startX[0] === endX && current.startY[0] === endY) {
      openSet.splice(i, 1);
      i--;
      len--;
      endX = current.endX[0];
      endY = current.endY[0];
      result.push(current);
    } else if (current.endX[0] === startX && current.endY[0] === startY) {
      openSet.splice(i, 1);
      i--;
      len--;
      startX = current.startX[0];
      startY = current.startY[0];
      result.unshift(current);
    }
  }
  // TODO: Repeat until reaching fixed point? Currently there are some cases when a continuous path is not collected
  // if its segments are disordered.
  return result;
}

/**
 * Converts a list of segments (in their definition order) to a list of path commands.
 */
function segmentsToCommands(segments: Segment[]): MorphCommand[] {
  const openSet: Segment[] = [...segments];
  const result: MorphCommand[] = [];
  while (openSet.length > 0) {
    const sequence: Segment[] = extractContinuous(openSet);
    result.push({
      type: MorphCommandType.MoveTo,
      x: sequence[0].startX,
      y: sequence[0].startY,
    });
    for (const segment of sequence) {
      switch (segment.type) {
        case SegmentType.Straight:
          result.push({
            type: MorphCommandType.LineTo,
            endX: segment.endX,
            endY: segment.endY,
          });
          break;
        case SegmentType.Curved:
          result.push({
            type: MorphCommandType.CurveTo,
            controlX: segment.controlX,
            controlY: segment.controlY,
            endX: segment.endX,
            endY: segment.endY,
          });
          break;
        default:
          throw new Error("Failed assertion: unexpected segment type");
      }
    }
  }
  return result;
}

/**
 * Converts a layer to a list of paths with style
 */
function layerToPaths(layer: StyleLayer): MorphPath[] {
  const paths: MorphPath[] = [];
  for (const fillSet of layer.fills) {
    const commands: MorphCommand[] = segmentsToCommands(fillSet.segments);
    if (commands.length > 0) {
      paths.push({commands, fill: fillSet.style});
    }
  }
  for (const lineSet of layer.lines) {
    const commands: MorphCommand[] = segmentsToCommands(lineSet.segments);
    if (commands.length > 0) {
      paths.push({commands, line: lineSet.style});
    }
  }
  return paths;
}

/**
 * Maintains the state of the decoder while it consumes morph shape records.
 */
class SwfMorphShapeDecoder {
  /**
   * Each definition of new styles creates a layer.
   */
  private layers: StyleLayer[];

  /**
   * Current style set for the left fill (fill0).
   */
  private leftFill: FillSegmentSet | undefined;
  /**
   * Current style set for the right fill (fill1).
   */
  private rightFill: FillSegmentSet | undefined;
  /**
   * Current style set for the line fill (line).
   */
  private lineFill: LineSegmentSet | undefined;

  /**
   * Current X position
   */
  private x: [number, number];

  /**
   * Current Y position
   */
  private y: [number, number];

  constructor(swfFillStyles: SwfMorphFillStyle[], swfLineStyles: SwfMorphLineStyle[]) {
    this.x = [0, 0];
    this.y = [0, 0];
    this.layers = [];
    this.leftFill = undefined;
    this.rightFill = undefined;
    this.lineFill = undefined;
    this.setNewStyles(swfFillStyles, swfLineStyles);
  }

  applyStyleChange(record: MorphStyleChange): void {
    if (record.leftFill !== undefined) {
      this.setLeftFillById(record.leftFill);
    }
    if (record.rightFill !== undefined) {
      this.setRightFillById(record.rightFill);
    }
    if (record.lineStyle !== undefined) {
      this.setLineFillById(record.lineStyle);
    }
    if (record.startMoveTo !== undefined) {
      if (record.endMoveTo === undefined) {
        // TODO: Use Incident
        throw new Error("Expected endMoveTo to be defined");
      }
      this.x = [record.startMoveTo.x, record.endMoveTo.x];
      this.y = [record.startMoveTo.y, record.endMoveTo.y];
    }
  }

  applyStraightEdge(record: MorphStraightEdge): void {
    const endX: [number, number] = [this.x[0] + record.startDelta.x, this.x[1] + record.endDelta.x];
    const endY: [number, number] = [this.y[0] + record.startDelta.y, this.y[1] + record.endDelta.y];

    if (this.leftFill !== undefined) {
      this.leftFill.segments.push(createStraightSegment(this.x, this.y, endX, endY));
    }
    if (this.rightFill !== undefined) {
      this.rightFill.segments.push(createStraightSegment(endX, endY, this.x, this.y));
    }
    if (this.lineFill !== undefined) {
      this.lineFill.segments.push(createStraightSegment(this.x, this.y, endX, endY));
    }

    this.x = endX;
    this.y = endY;
  }

  applyCurvedEdge(record: MorphCurvedEdge): void {
    const controlX: [number, number] = [this.x[0] + record.startControlDelta.x, this.x[1] + record.endControlDelta.x];
    const controlY: [number, number] = [this.y[0] + record.startControlDelta.y, this.y[1] + record.endControlDelta.y];
    const endX: [number, number] = [this.x[0] + record.startAnchorDelta.x, this.x[1] + record.endAnchorDelta.x];
    const endY: [number, number] = [this.y[0] + record.startAnchorDelta.y, this.y[1] + record.endAnchorDelta.y];

    if (this.leftFill !== undefined) {
      this.leftFill.segments.push(createCurvedSegment(this.x, this.y, controlX, controlY, endX, endY));
    }
    if (this.rightFill !== undefined) {
      this.rightFill.segments.push(createCurvedSegment(endX, endY, controlX, controlY, this.x, this.y));
    }
    if (this.lineFill !== undefined) {
      this.lineFill.segments.push(createCurvedSegment(this.x, this.y, controlX, controlY, endX, endY));
    }

    this.x = endX;
    this.y = endY;
  }

  getShape(): MorphShape {
    const paths: MorphPath[] = [];
    for (const layer of this.layers) {
      for (const path of layerToPaths(layer)) {
        paths.push(path);
      }
    }
    return {type: CharacterType.MorphShape, paths};
  }

  private setNewStyles(swfFillStyles: SwfMorphFillStyle[], swfLineStyles: SwfMorphLineStyle[]): void {
    const layer: StyleLayer = createStyleLayer(swfFillStyles, swfLineStyles);
    this.layers.push(layer);
    this.leftFill = undefined;
    this.rightFill = undefined;
    this.lineFill = undefined;
  }

  private setLeftFillById(fillId: UintSize): void {
    if (fillId === 0) {
      this.leftFill = undefined;
      return;
    }
    const currentLayer: StyleLayer = this.layers[this.layers.length - 1];
    const fillIndex: UintSize = fillId - 1;
    this.leftFill = currentLayer.fills[fillIndex];
    if (this.leftFill === undefined) {
      throw new Error("Invalid fill ID");
    }
  }

  private setRightFillById(fillId: UintSize): void {
    if (fillId === 0) {
      this.rightFill = undefined;
      return;
    }
    const currentLayer: StyleLayer = this.layers[this.layers.length - 1];
    const fillIndex: UintSize = fillId - 1;
    this.rightFill = currentLayer.fills[fillIndex];
    if (this.rightFill === undefined) {
      throw new Error("Invalid fill ID");
    }
  }

  private setLineFillById(fillId: UintSize): void {
    if (fillId === 0) {
      this.lineFill = undefined;
      return;
    }
    const currentLayer: StyleLayer = this.layers[this.layers.length - 1];
    const fillIndex: UintSize = fillId - 1;
    this.lineFill = currentLayer.lines[fillIndex];
    if (this.lineFill === undefined) {
      throw new Error("Invalid fill ID");
    }
  }
}
