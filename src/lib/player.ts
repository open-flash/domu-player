import { Incident } from "incident";
import { Renderer } from "swf-renderer/renderer";
import { TagType } from "swf-tree";
import { Movie } from "swf-tree/movie";
import { LoaderEvent, loadSwf, SwfLoader } from "./display/loader";
import { RootSprite } from "./display/sprite";
import { Stage } from "./display/stage";
import { ChildClock } from "./services/clock";
import { PausableClock, SchedulableClock, TimerHandle } from "./types/clock";

export interface PlayerOptions {
  movieUrl: string;
  clock: SchedulableClock;
  renderer: Renderer;
}

interface Loop {
  destroy(): void;
}

/**
 * The first tick is after `1000 / frameRate` ms.
 *
 * @param clock Clock used to control the loop.
 * @param frameRate Ticks per second
 * @param onTick
 * @return {Loop}
 */
function startLoop(clock: SchedulableClock, frameRate: number, onTick: () => any): Loop {
  const startTime: number = clock.getTime();
  let oldTime: number = startTime;
  let shift: number = 0;
  let nextTickCount: number = 0;
  let handle: TimerHandle | undefined = undefined;

  function handleTick(): void {
    onTick();
    scheduleNextTick();
  }

  function scheduleNextTick(): void {
    const curTime: number = clock.getTime();
    if (nextTickCount > 0 && curTime === oldTime) {
      // tslint:disable-next-line:max-line-length
      const infoUri: string = "https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#Reduced_time_precision";
      console.warn(`\`curTime === oldTime\`, possible reduced time precision, see ${infoUri}`);
    }
    oldTime = curTime;
    // console.log(clock.getTime());
    nextTickCount++;
    const targetTime: number = startTime + shift + (1000 * nextTickCount / frameRate);
    let timeout: number = targetTime - clock.getTime();
    if (timeout < 0) {
      shift += -timeout;
      console.warn(`Unable to maintain frameRate (missed by ${-timeout}ms)`);
      timeout = 0;
    }
    handle = clock.setTimeout(timeout, handleTick);
  }

  scheduleNextTick();

  function destroy(): void {
    if (handle !== undefined) {
      clock.clearTimeout(handle);
      handle = undefined;
    }
  }

  return {destroy};
}

enum PlayerState {
  AWAITING_HEADER,
  RUNNING,
  DESTROYED,
}

class Player implements PlayerInterface {
  private readonly clock: SchedulableClock & PausableClock;

  private readonly renderer: Renderer;

  private readonly movieUrl: string;

  private mainLoop?: Loop;

  // private state: PlayerState;

  private rootLoader?: SwfLoader;

  private stage?: Stage;

  constructor(options: PlayerOptions) {
    this.movieUrl = options.movieUrl;
    this.clock = new ChildClock(options.clock);
    this.renderer = options.renderer;
    this.rootLoader = undefined;
    this.stage = undefined;

    // this.state = PlayerState.AWAITING_HEADER;
    // // this.avm = new Avm();
    // this.stage = new Stage();
  }

  pause(): void {
    this.clock.pause();
  }

  resume(): void {
    this.clock.resume();
  }

  destroy(): void {
    if (this.mainLoop !== undefined) {
      this.mainLoop.destroy();
    }
    // this.state = PlayerState.DESTROYED;
  }

  start(): void {
    if (this.rootLoader !== undefined) {
      throw new Incident("Duplicate `start` call");
    }
    this.rootLoader = loadSwf(this.movieUrl);
    // this.rootLoader.events.once(LoaderEvent.SwfHeader, header => this.handleSwfHeaderLoaded(header));
    this.rootLoader.events.once(LoaderEvent.Complete, movie => this.handleSwfLoaded(movie));
  }

  // private handleSwfHeaderLoaded(header: SwfHeader): void {
  //   if (this.rootLoader === undefined || this.stage !== undefined) {
  //     console.error(new Incident("Unexpected state at `handleSwfHeaderLoaded`"));
  //     return;
  //   }
  //   this.stage = new RootStage(header, this.rootLoader);
  //
  //   this.mainLoop = startLoop(this.clock, header.frameRate.valueOf(), () => this.onTick());
  // }

  private async handleSwfLoaded(movie: Movie): Promise<void> {
    if (this.rootLoader === undefined || this.stage !== undefined) {
      console.error(new Incident("Unexpected state at `handleSwfHeaderLoaded`"));
      return;
    }
    this.stage = new Stage(movie.header.frameSize);
    for (const tag of movie.tags) {
      if (tag.type === TagType.DefineBitmap) {
        try {
          await this.renderer.addBitmap(tag);
        } catch (err) {
          console.error(err);
        }
      }
    }
    const rootSprite: RootSprite = new RootSprite(movie);
    this.stage.addChild(rootSprite);

    this.mainLoop = startLoop(this.clock, movie.header.frameRate.valueOf(), () => this.onTick());
  }

  private onTick(): void {
    const stage: Stage = this.stage!;
    stage.nextFrame(true, false); // TODO: Run scripts
    this.renderer.render(stage);
  }
}

export interface PlayerInterface {
  destroy(): void;
}

export function startPlayer(options: PlayerOptions): PlayerInterface {
  const player: Player = new Player(options);
  player.start();
  return player;
}
