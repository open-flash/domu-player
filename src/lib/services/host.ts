import { Host } from "../types/host";

export function createHost(): Host {
  return {
    random(): number {
      return Math.random();
    },
    unixTime(): number {
      return Date.now();
    },
  };
}
