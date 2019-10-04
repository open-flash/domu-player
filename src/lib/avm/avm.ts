import { AvmObject } from "avmore/avm-value";
import { BaseContext } from "avmore/context";
import { Host, NativeHost, Target } from "avmore/host";
import { setNatSlot } from "avmore/native-slot";
import { TargetId, Vm } from "avmore/vm";
import { UintSize } from "semantic-types";
import { Sprite } from "../display/sprite";
import { Avm1Context } from "../types/avm1-context";
import { createMovieClipRealm, MovieClipRealm } from "./native/movie-clip";
import { SPRITE } from "./slots";

//
// function getAvmSprite(vm: Vm, sprite: Sprite): AvmExternal {
//   let external: AvmExternal | undefined = AVM_SPRITE_CACHE.get(sprite);
//
//   if (external === undefined) {
//     const target: AvmObject = vm.newObject();
//     target.prototype = MovieClipBindings.getOrCreate(vm, REALM);
//     // const ownProperties: Map<string, AvmValue> = new Map();
//
//     external = vm.newExternal({
//       ownKeys(): AvmValue[] {
//         return [...target.ownProperties.keys()]
//           .map(value => ({type: AvmValueType.String as AvmValueType.String, value}));
//       },
//       get(key: string): AvmValue | undefined {
//         let value: AvmValue | undefined = vm.tryGetMember(target, key);
//         if (value === undefined) {
//           const namedChild: Sprite | undefined = sprite.namedChildren.get(key);
//           if (namedChild !== undefined) {
//             value = getAvmSprite(vm, namedChild);
//           }
//         }
//         return value;
//       },
//       set(key: string, value: AvmValue): void {
//         vm.setMember(target, key, value);
//       },
//     });
//     setNativeSlot(external, NativeSlot.SPRITE, sprite);
//     AVM_SPRITE_CACHE.set(sprite, external);
//   }
//
//   return external;
// }
//
// const TARGET_BY_ID: Map<number, Sprite> = new Map();
// const TARGET_TO_ID: Map<Sprite, number> = new Map();

export class DomuPlayerHost implements Host {
  private readonly nativeHost: NativeHost;
  private readonly targets: Map<TargetId, DomuPlayerTarget>;
  private readonly spriteToId: WeakMap<Sprite, TargetId>;

  constructor() {
    this.nativeHost = new NativeHost();
    this.targets = new Map();
    this.spriteToId = new WeakMap();
  }

  trace(message: string): void {
    this.nativeHost.trace(message);
  }

  warn(error: any): void {
    this.nativeHost.warn(error);
  }

  getTarget(targetId: TargetId): DomuPlayerTarget | undefined {
    return this.targets.get(targetId);
  }

  registerTarget(vm: Vm, sprite: Sprite): TargetId {
    {
      const id: TargetId | undefined = this.spriteToId.get(sprite);
      if (id !== undefined) {
        return id;
      }
    }
    const id: TargetId = this.targets.size;
    const obj: AvmObject = vm.newObject();
    const target: DomuPlayerTarget = new DomuPlayerTarget(sprite, obj);
    this.targets.set(id, target);
    this.spriteToId.set(sprite, id);
    return id;
  }
}

export class DomuPlayerTarget implements Target {
  private readonly sprite: Sprite;
  private readonly thisArg: AvmObject;

  constructor(sprite: Sprite, thisArg: AvmObject) {
    this.sprite = sprite;
    this.thisArg = thisArg;
  }

  getThis(): AvmObject {
    return this.thisArg;
  }

  stop(): void {
    this.sprite.stop();
  }

  play(): void {
    this.sprite.play();
  }

  gotoFrame(frameIndex: UintSize): void {
    this.sprite.gotoFrame(frameIndex);
  }

  gotoLabel(label: string): void {
    console.warn("NotImplemented: gotoLabel");
  }

  getFrameLoadingProgress(): {loaded: UintSize; total: UintSize} {
    return this.sprite.getFrameLoadingProgress();
  }
}

const AVM_SPRITE_CACHE: WeakMap<Sprite, AvmObject> = new WeakMap();

export function createAvm1Context(): Avm1Context {
  const host: DomuPlayerHost = new DomuPlayerHost();
  const vm: Vm = new Vm(host);
  const mcRealm: MovieClipRealm = createMovieClipRealm(vm.realm);
  vm.realm.globals.set("MovieClip", mcRealm.movieClip);

  function spriteToAvm(sprite: Sprite): AvmObject {
    return vm.withContext(ctx => getOrCreateSpriteAvmObject(ctx, sprite));
  }

  function getOrCreateSpriteAvmObject(ctx: BaseContext, sprite: Sprite): AvmObject {
    let spriteAvm: AvmObject | undefined = AVM_SPRITE_CACHE.get(sprite);
    if (spriteAvm === undefined) {
      spriteAvm = createSpriteAvmObject(ctx, sprite);
      AVM_SPRITE_CACHE.set(sprite, spriteAvm);
    }
    return spriteAvm;
  }

  // Create the AVM object attached to the provided sprite
  function createSpriteAvmObject(ctx: BaseContext, sprite: Sprite): AvmObject {
    // TODO: Handle `registerClass`
    const obj: AvmObject = vm.newObject(mcRealm.movieClipPrototype);
    setNatSlot(obj, SPRITE, sprite);
    // TODO: Set named children
    // ctx.setMember...
    ctx.apply(mcRealm.movieClip, obj, []);
    return obj;
  }

  return {vm, host, mcRealm, spriteToAvm};
}
