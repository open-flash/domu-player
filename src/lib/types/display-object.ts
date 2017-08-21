export interface DisplayObjectInterface {
  nextFrame(isMainLoop: boolean, runScripts: boolean): void;
}
