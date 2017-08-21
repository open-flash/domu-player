import { Incident } from "incident";
import { DisplayObject } from "./display-object";

export abstract class DisplayObjectContainer extends DisplayObject {
  readonly children: DisplayObject[];

  constructor() {
    super();
    this.children = [];
  }

  addChild(child: DisplayObject): void {
    this.addChildAtIndex(child, this.children.length);
  }

  addChildAtIndex(child: DisplayObject, index: number): void {
    index = index | 0; // Integer cast
    if (index < 0 || index > this.children.length) {
      throw new Incident("angeError", "Errors.ParamRangeError");
    }
    this.children.splice(index, 0, child);
  }

  addChildAtDepth(child: DisplayObject, depth: number): void {
    depth = depth | 0; // Integer cast
    let index: number = this.children.length;
    for (let i: number = this.children.length - 1; i >= 0; i--) {
      const current: DisplayObject = this.children[i];
      if (current.depth !== undefined) {
        if (current.depth < depth) {
          index = i + 1;
          break;
        }
        index = i;
      }
    }
    child.depth = depth;
    this.children.splice(index, 0, child);
  }

  getChildAtDepth(depth: number): DisplayObject | undefined {
    for (const child of this.children) {
      if (child.depth !== undefined && child.depth > depth) {
        break;
      }
      if (child.depth === depth) {
        return child;
      }
    }
    return undefined;
  }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {
    for (const child of this.children) {
      child.nextFrame(isMainLoop, runScripts);
    }
  }
}
