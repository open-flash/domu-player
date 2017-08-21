import { Avm } from "../avm";
import { AVM_FALSE, AvmCall, AvmCallResult, AvmNativeFunction, AvmObject, AvmValueType } from "../avm-value";
import { getArgs, nativeFunction, returnValue } from "../helpers";

/**
 * Object class
 */
export class Object {
  static create(vm: Avm): AvmNativeFunction {
    const hasOwnProperty: AvmNativeFunction = nativeFunction((call: AvmCall): AvmCallResult => {
      const [arg] = getArgs(1, call.args);
      return returnValue(AVM_FALSE);
    });

    const objectPrototype: AvmObject = {
      type: AvmValueType.Object,
      prototype: vm.constNull,
      ownProperties: new Map([
        ["hasOwnProperty", {value: hasOwnProperty}],
      ]),
    };

    const objectConstructor: AvmNativeFunction = nativeFunction((call: AvmCall): AvmCallResult => {
      const [proto] = getArgs(1, call.args);
      const result: AvmObject = {
        type: AvmValueType.Object,
        prototype: proto,
        ownProperties: new Map(),
      };
      return returnValue(result);
    });

    return objectConstructor;
  }
}
