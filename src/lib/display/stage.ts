import { Incident } from "incident";
import { Rect } from "swf-tree/rect";
// import { MovieClip } from "./movie-clip";
import { SRgb8 } from "swf-tree/s-rgb8";
import { DisplayObjectContainer } from "./display-object-container";
import { DisplayObjectVisitor } from "./display-object-visitor";

export type TwipsDist = number;
/**
 * Distance in virtual pixels
 */
export type VPxDist = number;

export interface StageInterface {
  backgroundColor: SRgb8;
}

// TODO: Get rid of these default values (they should never be needed)
const DEFAULT_BACKGROUND_COLOR: Readonly<SRgb8> = Object.freeze({r: 255, g: 255, b: 255});

/**
 * A stage represent a drawing area. It holds the root of its display tree.
 */
export class Stage extends DisplayObjectContainer {
  backgroundColor: SRgb8;
  width: VPxDist;
  height: VPxDist;

  constructor(frameSizeInTwips: Rect) {
    super();
    this.backgroundColor = DEFAULT_BACKGROUND_COLOR;
    this.width = (frameSizeInTwips.xMax.valueOf() - frameSizeInTwips.xMin.valueOf()) / 20;
    this.height = (frameSizeInTwips.yMax.valueOf() - frameSizeInTwips.yMin.valueOf()) / 20;
  }

  visit<R>(visitor: DisplayObjectVisitor<R>): R {
    return visitor.visitStage(this);
  }
}

// /**
//  * Primary stage created for the root SWF file.
//  */
// export class RootStage extends Stage {
//   movie: MovieClip;
//   loader: SwfLoader;
//
//   constructor(header: Header, loader: SwfLoader) {
//     super(header.frameSize);
//     this.movie = new MovieClip([]);
//   }
// }
