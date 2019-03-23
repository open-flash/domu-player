import { AvmValue } from "avmore/avm-value";
import { Vm } from "avmore/vm";
import { Realm } from "../realm";

export class ObjectBindings {
  static readonly SYMBOL: unique symbol = Symbol("Object");

  static getOrCreate(vm: Vm, realm: Realm): AvmValue {
    let bindings: AvmValue | undefined = realm.get(ObjectBindings.SYMBOL);
    if (bindings === undefined) {
      bindings = vm.newObject();
    }
    return bindings;
  }
}

// /**
//  * Object class
//  */
// export class Object {
//   static create(vm: Avm): AvmNativeFunction {
//     const hasOwnProperty: AvmNativeFunction = nativeFunction((call: AvmCall): AvmCallResult => {
//       const [arg] = getArgs(1, call.args);
//       return returnValue(AVM_FALSE);
//     });
//
//     const objectPrototype: AvmObject = {
//       type: AvmValueType.Object,
//       prototype: vm.constNull,
//       ownProperties: new Map([
//         ["hasOwnProperty", {value: hasOwnProperty}],
//       ]),
//     };
//
//     const objectConstructor: AvmNativeFunction = nativeFunction((call: AvmCall): AvmCallResult => {
//       const [proto] = getArgs(1, call.args);
//       const result: AvmObject = {
//         type: AvmValueType.Object,
//         prototype: proto,
//         ownProperties: new Map(),
//       };
//       return returnValue(result);
//     });
//
//     return objectConstructor;
//   }
// }
