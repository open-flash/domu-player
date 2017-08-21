/**
 * Player host environment.
 */
import { Clock, PausableClock } from "./clock";

export interface Host {
  /**
   * A return float64 uniformly chosen in the range [0, 1).
   *
   * @return Random float64 in [0, 1)
   */
  random(): number;

  // /**
  //  * Time since the player started, in milliseconds.
  //  *
  //  * @return Time in ms since the player started.
  //  */
  // playerClock(): PausableClock;

  /**
   * Time since the UNIX epoch, in milliseconds.
   *
   * @return Time in ms since the UNIX epoch.
   */
  unixTime(): number;

  onInput?(handler: (data: string) => void): void;

  writeOut?(data: string): void;

  writeErr?(data: string): void;
}
