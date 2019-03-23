import { AvmExternal, AvmObject, AvmValue, AvmValueType } from "avmore/avm-value";
import { Host, NativeHost } from "avmore/host";
import { Avm1ScriptId, Vm } from "avmore/vm";
import { Sprite } from "../display/sprite";
import { Avm1Context } from "../types/avm1-context";
import { MovieClipBindings } from "./native/movie-clip";
import { Realm } from "./realm";
import { NativeSlot, setNativeSlot } from "./slots";
import { TargetId } from "avmore/_src/vm";
import { Target } from "avmore/_src/host";

const REALM: Realm = new Map();

const AVM_SPRITE_CACHE: WeakMap<Sprite, AvmExternal> = new WeakMap();

function getAvmSprite(vm: Vm, sprite: Sprite): AvmExternal {
  let external: AvmExternal | undefined = AVM_SPRITE_CACHE.get(sprite);

  if (external === undefined) {
    const target: AvmObject = vm.newObject();
    target.prototype = MovieClipBindings.getOrCreate(vm, REALM);
    // const ownProperties: Map<string, AvmValue> = new Map();

    external = vm.newExternal({
      ownKeys(): AvmValue[] {
        return [...target.ownProperties.keys()]
          .map(value => ({type: AvmValueType.String as AvmValueType.String, value}));
      },
      get(key: string): AvmValue | undefined {
        let value: AvmValue | undefined = vm.tryGetMember(target, key);
        if (value === undefined) {
          const namedChild: Sprite | undefined = sprite.namedChildren.get(key);
          if (namedChild !== undefined) {
            value = getAvmSprite(vm, namedChild);
          }
        }
        return value;
      },
      set(key: string, value: AvmValue): void {
        vm.setMember(target, key, value);
      },
    });
    setNativeSlot(external, NativeSlot.SPRITE, sprite);
    AVM_SPRITE_CACHE.set(sprite, external);
  }

  return external;
}

const TARGET_BY_ID: Map<number, Sprite> = new Map();
const TARGET_TO_ID: Map<Sprite, number> = new Map();

export function createAvm1Context(): Avm1Context {
  const vm: Vm = new Vm();
  const nativeHost: NativeHost = new NativeHost();

  const host: Host = {
    trace: nativeHost.trace,
    getTarget(targetId: TargetId): Target | undefined {
      const target: Sprite | undefined = TARGET_BY_ID.get(targetId);
      if (target === undefined) {
        // TODO: Warn (unknown target)
        return undefined;
      }
      return {
        stop() {
          target.stop();
        },
      };
    },
  };

  return {executeActions};

  function executeActions(target: Sprite, avm1Bytes: Uint8Array): void {
    let targetId: number | undefined = TARGET_TO_ID.get(target);
    if (targetId === undefined) {
      targetId = TARGET_TO_ID.size;
      TARGET_TO_ID.set(target, targetId);
      TARGET_BY_ID.set(targetId, target);
    }

    const external: AvmExternal = getAvmSprite(vm, target);
    const scriptId: Avm1ScriptId = vm.createAvm1Script(avm1Bytes, targetId, external);
    vm.runToCompletion(scriptId, host);
  }
}
