import { AVM_UNDEFINED, AvmExternal, AvmObject, AvmValue, AvmValueType } from "avmore/avm-value";
import { Vm } from "avmore/vm";
import { Sprite } from "../../display/sprite";
import { Realm } from "../realm";
import { getNativeSlot, NativeSlot } from "../slots";

export class MovieClipBindings {
  static readonly SYMBOL: unique symbol = Symbol("MovieClip");

  static getOrCreate(vm: Vm, realm: Realm): AvmObject {
    let bindings: AvmObject | undefined = realm.get(MovieClipBindings.SYMBOL) as AvmObject;
    if (bindings === undefined) {
      bindings = vm.newObject();
      const prototype: AvmObject = vm.newObject();
      vm.setMember(prototype, "gotoAndPlay", MovieClipGotoAndPlayBindings.getOrCreate(vm, realm));
      bindings.prototype = prototype;
      realm.set(MovieClipBindings.SYMBOL, bindings);
    }
    return bindings;
  }
}

export class MovieClipGotoAndPlayBindings {
  static readonly SYMBOL: unique symbol = Symbol("MovieClip#gotoAndPlay");

  static getOrCreate(vm: Vm, realm: Realm): AvmExternal {
    let bindings: AvmExternal | undefined = realm.get(MovieClipGotoAndPlayBindings.SYMBOL) as AvmExternal;
    if (bindings === undefined) {
      bindings = vm.newExternal({
        apply(thisArg: AvmObject, args: AvmValue[]): AvmValue {
          const sprite: Sprite | undefined = getNativeSlot(thisArg, NativeSlot.SPRITE);
          if (sprite === undefined) {
            throw new Error("MissingSlot: [[sprite]]");
          }
          let frame: number | string;
          if (args.length > 0) {
            const frameArg: AvmValue = args[0];
            switch (frameArg.type) {
              case AvmValueType.Number: {
                frame = frameArg.value;
                break;
              }
              case AvmValueType.String: {
                frame = frameArg.value;
                break;
              }
              default: {
                throw new Error("InvalidFrameArgType");
              }
            }
          } else {
            throw new Error("NotEnoughArguments");
          }
          sprite.gotoAndPlay(frame);
          return AVM_UNDEFINED;
        },
        ownKeys(): AvmValue[] {
          return [];
        },
        get(key: string): AvmValue | undefined {
          return undefined;
        },
        set(): void {
        },
      });
      realm.set(MovieClipGotoAndPlayBindings.SYMBOL, bindings);
    }
    return bindings;
  }
}
