import { Incident } from "incident";
import { DisplayObjectContainer as RendererDisplayObjectContainer } from "swf-renderer/display/display-object-container";
import { DisplayObjectType } from "swf-renderer/display/display-object-type";
import { DisplayObject } from "./display-object";
import { DisplayObjectBase } from "./display-object-base";

export abstract class DisplayObjectContainer extends DisplayObjectBase implements RendererDisplayObjectContainer {
  readonly type: DisplayObjectType.Container;
  readonly children: DisplayObject[];

  constructor() {
    super();
    this.type = DisplayObjectType.Container;
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

  // TODO: Rename to `setChildAtDepth`
  // TODO: Handle collisions (we should replace the child)
  setChildAtDepth(child: DisplayObject, depth: number): void {
    depth = depth | 0; // Integer cast
    let index: number = this.children.length;
    let deleteCount: number = 0;
    for (let i: number = this.children.length - 1; i >= 0; i--) {
      const current: DisplayObject = this.children[i];
      if (current.depth === undefined) {
        // TODO: Throw error, a child MUST have a depth if it is attached to a parent
        continue;
      }
      if (current.depth === depth) {
        index = i;
        deleteCount = 1;
        break;
      }
      if (current.depth < depth) {
        index = i + 1;
        break;
      }
      index = i;
    }
    child.depth = depth;
    this.children.splice(index, deleteCount, child);
  }

  // Noop if there's nothing at the provided depth
  removeChildAtDepth(depth: number): void {
    // TODO: The linear search could be replaced by a binary search
    for (let i: number = 0; i < this.children.length; i++) {
      const child: DisplayObjectBase = this.children[i];
      if (child.depth === depth) {
        child.depth = undefined;
        this.children.splice(i, 1);
        break;
      }
    }
  }

  getChildAtDepth(depth: number): DisplayObjectBase | undefined {
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
