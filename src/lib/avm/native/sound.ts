import { AvmObject, AvmPropDescriptor, AvmSimpleObject, AvmValue, AvmValueType } from "avmore/avm-value";
import { NatCallContext } from "avmore/context";
import { CallableType } from "avmore/function";
import { bindingFromHostFunction } from "avmore/realm";
import { CoreRealm } from "avmore/realm/core";

export interface SoundRealm {
  sound: AvmSimpleObject;
  soundPrototype: AvmSimpleObject;
  soundPrototypeAttachSound: AvmObject;
  soundPrototypeGetBytesLoaded: AvmObject;
  soundPrototypeGetBytesTotal: AvmObject;
  soundPrototypeGetPan: AvmObject;
  soundPrototypeGetTransform: AvmObject;
  soundPrototypeGetVolume: AvmObject;
  soundPrototypeLoadSound: AvmObject;
  soundPrototypeSetPan: AvmObject;
  soundPrototypeSetTranform: AvmObject;
  soundPrototypeSetVolume: AvmObject;
  soundPrototypeStart: AvmObject;
  soundPrototypeStop: AvmObject;
}

export function createSoundRealm(core: CoreRealm): SoundRealm {
  // tslint:disable:max-line-length
  const _soundPrototypeAttachSound: AvmObject = bindingFromHostFunction(core.functionPrototype, soundPrototypeAttachSound);
  const _soundPrototypeGetBytesLoaded: AvmObject = bindingFromHostFunction(core.functionPrototype, soundPrototypeGetBytesLoaded);
  const _soundPrototypeGetBytesTotal: AvmObject = bindingFromHostFunction(core.functionPrototype, soundPrototypeGetBytesTotal);
  const _soundPrototypeGetPan: AvmObject = bindingFromHostFunction(core.functionPrototype, soundPrototypeGetPan);
  const _soundPrototypeGetTransform: AvmObject = bindingFromHostFunction(core.functionPrototype, soundPrototypeGetTransform);
  const _soundPrototypeGetVolume: AvmObject = bindingFromHostFunction(core.functionPrototype, soundPrototypeGetVolume);
  const _soundPrototypeLoadSound: AvmObject = bindingFromHostFunction(core.functionPrototype, soundPrototypeLoadSound);
  const _soundPrototypeSetPan: AvmObject = bindingFromHostFunction(core.functionPrototype, soundPrototypeSetPan);
  const _soundPrototypeSetTranform: AvmObject = bindingFromHostFunction(core.functionPrototype, soundPrototypeSetTranform);
  const _soundPrototypeSetVolume: AvmObject = bindingFromHostFunction(core.functionPrototype, soundPrototypeSetVolume);
  const _soundPrototypeStart: AvmObject = bindingFromHostFunction(core.functionPrototype, soundPrototypeStart);
  const _soundPrototypeStop: AvmObject = bindingFromHostFunction(core.functionPrototype, soundPrototypeStop);
  // tslint:enable

  // Sound.prototype
  const soundPrototype: AvmSimpleObject = {
    type: AvmValueType.Object,
    external: false,
    class: "Object",
    prototype: core.objectPrototype,
    ownProperties: new Map([
      ["attachSound", AvmPropDescriptor.data(_soundPrototypeAttachSound)],
      ["getBytesLoaded", AvmPropDescriptor.data(_soundPrototypeGetBytesLoaded)],
      ["getBytesTotal", AvmPropDescriptor.data(_soundPrototypeGetBytesTotal)],
      ["getPan", AvmPropDescriptor.data(_soundPrototypeGetPan)],
      ["getTransform", AvmPropDescriptor.data(_soundPrototypeGetTransform)],
      ["getVolume", AvmPropDescriptor.data(_soundPrototypeGetVolume)],
      ["loadSound", AvmPropDescriptor.data(_soundPrototypeLoadSound)],
      ["setPan", AvmPropDescriptor.data(_soundPrototypeSetPan)],
      ["setTranform", AvmPropDescriptor.data(_soundPrototypeSetTranform)],
      ["setVolume", AvmPropDescriptor.data(_soundPrototypeSetVolume)],
      ["start", AvmPropDescriptor.data(_soundPrototypeStart)],
      ["stop", AvmPropDescriptor.data(_soundPrototypeStop)],
    ]),
    callable: undefined,
  };

  // Sound
  const _sound: AvmSimpleObject = {
    type: AvmValueType.Object,
    external: false,
    class: "Function",
    prototype: core.functionPrototype,
    ownProperties: new Map([
      ["prototype", AvmPropDescriptor.data(soundPrototype)],
    ]),
    callable: {type: CallableType.Host, handler: sound},
  };

  soundPrototype.ownProperties.set("constructor", AvmPropDescriptor.data(_sound));

  return {
    sound: _sound,
    soundPrototype,
    soundPrototypeAttachSound: _soundPrototypeAttachSound,
    soundPrototypeGetBytesLoaded: _soundPrototypeGetBytesLoaded,
    soundPrototypeGetBytesTotal: _soundPrototypeGetBytesTotal,
    soundPrototypeGetPan: _soundPrototypeGetPan,
    soundPrototypeGetTransform: _soundPrototypeGetTransform,
    soundPrototypeGetVolume: _soundPrototypeGetVolume,
    soundPrototypeLoadSound: _soundPrototypeLoadSound,
    soundPrototypeSetPan: _soundPrototypeSetPan,
    soundPrototypeSetTranform: _soundPrototypeSetTranform,
    soundPrototypeSetVolume: _soundPrototypeSetVolume,
    soundPrototypeStart: _soundPrototypeStart,
    soundPrototypeStop: _soundPrototypeStop,
  };
}

export function sound(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound");
}

export function soundPrototypeAttachSound(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound.prototype.attachSound");
}

export function soundPrototypeGetBytesLoaded(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound.prototype.getBytesLoaded");
}

export function soundPrototypeGetBytesTotal(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound.prototype.getBytesTotal");
}

export function soundPrototypeGetPan(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound.prototype.getPan");
}

export function soundPrototypeGetTransform(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound.prototype.getTransform");
}

export function soundPrototypeGetVolume(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound.prototype.getVolume");
}

export function soundPrototypeLoadSound(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound.prototype.loadSound");
}

export function soundPrototypeSetPan(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound.prototype.setPan");
}

export function soundPrototypeSetTranform(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound.prototype.setTranform");
}

export function soundPrototypeSetVolume(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound.prototype.setVolume");
}

export function soundPrototypeStart(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound.prototype.start");
}

export function soundPrototypeStop(ctx: NatCallContext): AvmValue {
  throw new Error("NotImplemented: Sound.prototype.stop");
}
