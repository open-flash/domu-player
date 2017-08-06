/**
 * Polyfill to ensure that the `asyncIterator` symbol is defined
 */
export function asyncIterator(): void {
  if (!Symbol.asyncIterator) {
    (Symbol as any).asyncIterator = Symbol.for("Symbol.asyncIterator");
  }
}

/**
 * Applies all the polyfills
 */
export function all(): void {
  asyncIterator();
}
