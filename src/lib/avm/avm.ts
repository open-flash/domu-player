import { AvmObject } from "avmore/avm-value";
import { BaseContext } from "avmore/context";
import { Host, NativeHost, Target } from "avmore/host";
import { setNatSlot } from "avmore/native-slot";
import { TargetId, Vm } from "avmore/vm";
import { UintSize } from "semantic-types";
import { Sprite } from "../display/sprite";
import { Avm1Context } from "../types/avm1-context";
import { createMovieClipRealm, MovieClipRealm } from "./native/movie-clip";
import { createSoundRealm, SoundRealm } from "./native/sound";
import { SPRITE } from "./slots";

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
    // TODO: Only `.goto` (do not play if stopped)?
    this.sprite.gotoAndPlay(label);
    // console.warn("NotImplemented: gotoLabel");
  }

  getFrameLoadingProgress(): {loaded: UintSize; total: UintSize} {
    return this.sprite.getFrameLoadingProgress();
  }
}

const AVM_SPRITE_CACHE: WeakMap<Sprite, AvmObject> = new WeakMap();

export function createAvm1Context(): Avm1Context {
  const host: DomuPlayerHost = new DomuPlayerHost();
  const vm: Vm = new Vm(host);
  const movieClipRealm: MovieClipRealm = createMovieClipRealm(vm.realm);
  const soundRealm: SoundRealm = createSoundRealm(vm.realm);
  vm.realm.globals.set("MovieClip", movieClipRealm.movieClip);
  vm.realm.globals.set("Sound", soundRealm.sound);

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
    const obj: AvmObject = vm.newObject(movieClipRealm.movieClipPrototype);
    setNatSlot(obj, SPRITE, sprite);
    // TODO: Set named children
    // ctx.setMember...
    ctx.apply(movieClipRealm.movieClip, obj, []);
    return obj;
  }

  return {vm, host, spriteToAvm};
}
