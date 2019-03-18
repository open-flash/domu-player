import { NativeHost } from "avmore/host";
import { Avm1ScriptId, Vm } from "avmore/vm";
import { Avm1Context } from "../types/avm1-context";
import { AvmBoolean, AvmCallResult, AvmFunction, AvmNull, AvmUndefined, AvmValue, AvmValueType } from "./avm-value";

export class Avm {
  readonly constNull: Readonly<AvmNull>;
  readonly constUndefined: Readonly<AvmUndefined>;
  readonly constTrue: Readonly<AvmBoolean>;
  readonly constFalse: Readonly<AvmBoolean>;

  constructor() {
    this.constNull = Object.freeze(<AvmNull> {type: AvmValueType.Null});
    this.constUndefined = Object.freeze(<AvmUndefined> {type: AvmValueType.Undefined});
    this.constTrue = Object.freeze(<AvmBoolean> {type: AvmValueType.Boolean, value: true});
    this.constFalse = Object.freeze(<AvmBoolean> {type: AvmValueType.Boolean, value: false});
  }

  call(fn: AvmFunction, args: AvmValue[]): AvmCallResult {
    if (fn.native) {
      return fn.handler({args});
    } else {
      return [false, this.constUndefined];
    }
  }
}

export function createAvm1Context(): Avm1Context {
  const vm: Vm = new Vm();
  const host: NativeHost = new NativeHost();

  return {executeActions};

  function executeActions(thisArg: null, avm1Bytes: Uint8Array): void {
    const scriptId: Avm1ScriptId = vm.createAvm1Script(avm1Bytes, null);
    vm.runToCompletion(scriptId, host);
  }
}
