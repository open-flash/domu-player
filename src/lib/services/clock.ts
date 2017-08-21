import { Clock, PausableClock, SchedulableClock, TimerHandle } from "../types/clock";

function createSystemClock(): SchedulableClock {
  type NativeTimerHandle = number | NodeJS.Timer;

  const handles: WeakMap<TimerHandle, NativeTimerHandle> = new WeakMap();

  return Object.freeze({
    getTime: Date.now,
    setTimeout(timeout: number, handler: () => any): TimerHandle {
      const nativeHandle: NativeTimerHandle = setTimeout(handler, timeout);
      const handle: TimerHandle = new Object(Symbol());
      handles.set(handle, nativeHandle);
      return handle;
    },
    clearTimeout(handle: TimerHandle): void {
      const nativeHandle: NativeTimerHandle | undefined = handles.get(handle);
      if (nativeHandle !== undefined) {
        // TODO: Better type with cross-platform  support
        clearTimeout(nativeHandle as any);
      }
    },
  });
}

export const SYSTEM_CLOCK: SchedulableClock = createSystemClock();

/**
 * Represents a currently scheduled task in a `ChildClock`.
 */
interface Task {
  /**
   * Time in the current clock when this task should be executed.
   */
  targetTime: number;

  /**
   * Timer handle received by the parent clock when scheduling the task.
   * This is undefined when the task is not scheduled (when the clock is paused).
   */
  handle?: TimerHandle;

  /**
   * Handler function triggered once the timeout is complete.
   */
  handler(): any;
}

/**
 * Represents a node in a clock tree.
 */
export class ChildClock implements PausableClock, SchedulableClock {
  private readonly parent: SchedulableClock;

  /**
   * Origin of time for this clock.
   * Relative to parent clock, or the UNIX epoch for the root clock.
   * Resuming the clock will update the update to maintain the continuity of the time (no time is skipped).
   */
  private epoch: number;

  /**
   * If this clock is not paused `undefined`, otherwise it is the time in the parent clock when `pause` was called.
   */
  private pausedAt: number | undefined;

  /**
   * Map from outer handles to task states.
   */
  private readonly tasks: Map<TimerHandle, Task>;

  /**
   * @param parent Parent clock
   * @param initialEpoch Time in the parent clock corresponding to the zero time in the child clock.
   *                     Default is parent.getTime().
   */
  constructor(parent: SchedulableClock, initialEpoch?: number) {
    this.parent = parent;
    this.epoch = initialEpoch !== undefined ? initialEpoch : parent.getTime();
    this.pausedAt = undefined;
    this.tasks = new Map();
  }

  isPaused(): boolean {
    return this.pausedAt !== undefined;
  }

  /**
   * @return Time in milliseconds
   */
  getTime(): number {
    return this.pausedAt !== undefined ? this.pausedAt : this.parent.getTime() - this.epoch;
  }

  pause(): void {
    if (this.pausedAt === undefined) {
      this.pausedAt = this.parent.getTime();
      for (const task of this.tasks.values()) {
        if (task.handle !== undefined) {
          this.parent.clearTimeout(task.handle);
          task.handle = undefined;
        }
      }
    }
  }

  resume(): void {
    if (this.pausedAt !== undefined) {
      this.epoch += this.parent.getTime() - this.pausedAt;
      this.pausedAt = undefined;
      for (const task of this.tasks.values()) {
        task.handle = this.parent.setTimeout(task.targetTime - this.getTime(), task.handler);
      }
    }
  }

  setTimeout(timeout: number, handler: () => any): TimerHandle {
    const outerHandle: TimerHandle = new Object(Symbol());
    const task: Task = {
      targetTime: this.getTime() + timeout,
      handler: (): void => {
        this.tasks.delete(outerHandle);
        handler();
      },
      handle: undefined,
    };
    this.tasks.set(outerHandle, task);
    if (this.pausedAt === undefined) {
      task.handle = this.parent.setTimeout(timeout, task.handler);
    }
    return outerHandle;
  }

  clearTimeout(handle: TimerHandle): void {
    const task: Task | undefined = this.tasks.get(handle);
    if (task !== undefined) {
      if (task.handle !== undefined) {
        this.parent.clearTimeout(task.handle);
      }
      this.tasks.delete(handle);
    }
  }
}

/**
 * Create a new root clock based off real time.
 * Its epoch defaults to `now`. You can provide you own epoch relative to the UNIX epoch (expressed in milliseconds).
 *
 * @param {number} epoch
 * @return {Clock}
 */
export function createClock(epoch: number = SYSTEM_CLOCK.getTime()): SchedulableClock & PausableClock {
  return new ChildClock(SYSTEM_CLOCK, epoch);
}
