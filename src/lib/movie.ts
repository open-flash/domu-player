import { Header as SwfHeader } from "swf-tree/header";
import { Tag as SwfTag } from "swf-tree/tag";
import { collectFrames } from "./display/frame";
import { MovieClip } from "./display/movie-clip";
import { Stage } from "./display/stage";
import { Scheduler } from "./types/scheduler";

export interface MovieInterface {
  play(): void;
  stop(): void;
  handleEvent(event: any): void;
}

export class Movie implements MovieInterface {
  private readonly header: SwfHeader;
  private readonly scheduler: Scheduler;
  private readonly stage: Stage;

  constructor(header: SwfHeader, tags: Iterable<SwfTag>, scheduler: Scheduler) {
    this.header = header;
    const mainMovieClip: MovieClip = new MovieClip(collectFrames(tags));
    this.stage = new Stage(mainMovieClip);

    this.scheduler = scheduler;
  }

  play(): void {
    this.scheduler.run();
  }

  stop(): void {

  }

  handleEvent(event: any): void {

  }

  private onNewFrame(): void {

  }
}
