export interface Clock {
  getTime(): number;
}

export type TimerHandle = object;

export interface SchedulableClock<H = TimerHandle> extends Clock {
  setTimeout(timeout: number, handler: () => any): H;
  clearTimeout(handle: H): void;
}

export interface PausableClock extends Clock {
  isPaused(): boolean;

  pause(): void;

  resume(): void;
}
