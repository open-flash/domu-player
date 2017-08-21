import { AvmObject, AvmObjectProperty } from "./avm-value";

export class AvmObjectBuilder {
  prototype?: AvmObject;
  properties: Map<string, AvmObjectProperty>;

  constructor() {
    this.prototype = undefined;
    this.properties = new Map();
  }

  setProperty(name: string, value: AvmObject): void {
    this.properties.set(name, {value});
  }

  setPrototype(value: AvmObject): void {
    this.prototype = value;
  }

  /**
   * You should only call `finalize` once per instance
   */
  finalize(): AvmObject {
    return Object.assign(
      Object.create(null),
      {
        prototype: this.prototype,
        properties: this.properties,
      },
    );
  }
}
