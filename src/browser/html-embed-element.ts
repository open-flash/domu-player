/**
 * Fixed interfaces for `HTMLEmbedElement`.
 *
 * @see https://github.com/Microsoft/TSJS-lib-generator/issues/355
 */
export interface FixedHTMLEmbedElement extends HTMLElement {
  /**
   * Sets or retrieves the height of the object.
   */
  height: string;
  hidden: any;
  /**
   * Sets or retrieves the name of the object.
   */
  name: string;
  /**
   * Retrieves the palette used for the embedded document.
   */
  readonly palette?: string;
  /**
   * Retrieves the URL of the plug-in used to view an embedded document.
   */
  readonly pluginspage?: string;
  readonly readyState?: string;
  /**
   * Sets or retrieves a URL to be loaded by the object.
   */
  src: string;
  /**
   * Sets or retrieves the height and width units of the embed object.
   */
  units?: string;
  /**
   * Sets or retrieves the width of the object.
   */
  width: string;

  // tslint:disable-next-line:max-line-length
  addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLEmbedElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

  getSVGDocument?(): Document | null;

  // tslint:disable-next-line:max-line-length
  removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLEmbedElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
