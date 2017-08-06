import {fromNormalizedColor} from "../css-color";
import {FillStyleType} from "../shape/fill-style";
import {LineStyleType} from "../shape/line-style";
import {CommandType, Path} from "../shape/path";
import {Shape} from "../shape/shape";
import {Renderer} from "./renderer";

export class CanvasRenderer implements Renderer {
  private readonly context: CanvasRenderingContext2D;
  private readonly width: number;
  private readonly height: number;

  constructor(context: CanvasRenderingContext2D, width: number, height: number) {
    this.context = context;
    this.width = width;
    this.height = height;
  }

  drawShape(shape: Shape): void {
    this.context.save();
    try {
      this.context.scale(1 / 20, 1 / 20);
      for (const path of shape.paths) {
        this.drawPath(path);
      }
    } catch (err) {
      throw err;
    } finally {
      this.context.restore();
    }
  }

  clear(): void {
    this.context.fillStyle = "transparent";
    this.context.fillRect(0, 0, this.width, this.height);
  }

  private drawPath(path: Path): void {
    if (path.fill === undefined && path.line === undefined || path.commands.length === 0) {
      return;
    }

    this.context.beginPath();

    for (const command of path.commands) {
      switch (command.type) {
        case CommandType.CurveTo:
          this.context.quadraticCurveTo(command.controlX, command.controlY, command.endX, command.endY);
          break;
        case CommandType.LineTo:
          this.context.lineTo(command.endX, command.endY);
          break;
        case CommandType.MoveTo:
          this.context.moveTo(command.x, command.y);
          break;
        default:
          throw new Error("FailedAssertion: Unexpected command");
      }
    }

    if (path.fill !== undefined) {
      switch (path.fill.type) {
        case FillStyleType.Solid:
          this.context.fillStyle = fromNormalizedColor(path.fill.color);
          break;
        default:
          throw new Error("TODO: FailedAssertion");
      }
      this.context.fill();
    }

    if (path.line !== undefined) {
      switch (path.line.type) {
        case LineStyleType.Solid:
          this.context.lineWidth = path.line.width;
          this.context.strokeStyle = fromNormalizedColor(path.line.color);
          break;
        default:
          throw new Error("TODO: FailedAssertion");
      }
      this.context.stroke();
    }
  }
}
