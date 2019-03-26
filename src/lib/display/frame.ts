import { TagType } from "swf-tree";
import { Tag as SwfTag } from "swf-tree/tag";
import { DoAction } from "swf-tree/tags";
import { ControlTag } from "../types/control-tag";

export class Frame {
  // TODO: Remove the catch-all tags list in favor of more specific members (e.g. `controlTags`)
  public readonly tags: SwfTag[];

  public readonly controlTags: ControlTag[];

  public readonly actions: DoAction[];

  // labelName: string;
  // soundStreamHead: Parser.SoundStream;
  // soundStreamBlock: Uint8Array;
  // actionBlocks: ActionBlock[];
  // initActionBlocks: InitActionBlock[];
  // exports: SymbolExport[];

  constructor(tags: SwfTag[]) {
    const controlTags: ControlTag[] = [];
    const actions: DoAction[] = [];
    for (const tag of tags) {
      switch (tag.type) {
        case TagType.DoAction:
          actions.push(tag);
          break;
        case TagType.PlaceObject:
        case TagType.RemoveObject:
          controlTags.push(tag);
          break;
        default:
          break;
      }
    }
    this.tags = tags;
    this.controlTags = controlTags;
    this.actions = actions;
  }
}

export function* collectFrames(tags: Iterable<SwfTag>): Iterable<Frame> {
  let curTags: SwfTag[] = [];
  for (const tag of tags) {
    curTags.push(tag);
    if (tag.type === TagType.ShowFrame) {
      yield new Frame(curTags);
      curTags = [];
    }
  }
}
