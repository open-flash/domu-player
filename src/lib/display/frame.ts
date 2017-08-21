import { TagType } from "swf-tree";
import { Tag as SwfTag } from "swf-tree/tag";

export class Frame {
  public readonly tags: SwfTag[];

  // labelName: string;
  // soundStreamHead: Parser.SoundStream;
  // soundStreamBlock: Uint8Array;
  // actionBlocks: ActionBlock[];
  // initActionBlocks: InitActionBlock[];
  // exports: SymbolExport[];

  constructor(tags: SwfTag[]) {
    this.tags = tags;
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
