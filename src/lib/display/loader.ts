import { EventEmitter } from "events";
import { Movie } from "swf-tree/movie";
import { getMovie } from "../../browser/xhr-loader"; // TODO: Abstract this
import { DisplayObjectBase } from "./display-object-base";
import { DisplayObjectVisitor } from "./display-object-visitor";
import { Sprite } from "./sprite";

export enum LoaderEvent {
  SwfHeader = "LoaderEvent.SwfHeader",
  Complete = "LoaderEvent.Complete",
}

/**
 * You can insert a loader in the display tree, it will display data as it loads it.
 */
export class SwfLoader extends DisplayObjectBase {
  readonly url: string;
  readonly events: EventEmitter;
  sprite?: Sprite;

  constructor(url: string) {
    super();
    this.url = url;
    this.events = new EventEmitter();
    this.sprite = undefined;
  }

  start(): void {
    getMovie(this.url).then(movie => this.handleMovieLoaded(movie));
  }

  visit<R>(visitor: DisplayObjectVisitor<R>): R {
    return visitor.visitLoader(this);
  }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {
    if (this.sprite === undefined) {
      return;
    }
    console.log("Updating loader");
  }

  private handleMovieLoaded(movie: Movie): void {
    this.events.emit(LoaderEvent.SwfHeader, movie.header);
    // this.sprite = new Sprite();
    this.events.emit(LoaderEvent.Complete, movie);
  }
}

export function loadSwf(swfUrl: string): SwfLoader {
  const loader: SwfLoader = new SwfLoader(swfUrl);
  loader.start();
  return loader;
}
