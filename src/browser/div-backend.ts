/**
 * Represents a player stage using a `<div>` as its root.
 */
export class DivBackend {
  private root: HTMLDivElement;

  constructor(root: HTMLDivElement) {
    this.root = root;
  }
}
