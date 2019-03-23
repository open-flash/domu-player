import { AvmValue } from "avmore/avm-value";
import { Sprite } from "../display/sprite";

export namespace NativeSlot {
  export const AUDIO: unique symbol = Symbol("[[audio]]");
  export const SPRITE: unique symbol = Symbol("[[sprite]]");
}

export type NativeSlot = typeof NativeSlot.AUDIO | typeof NativeSlot.SPRITE;

const NATIVE_SLOTS: WeakMap<AvmValue, Map<NativeSlot, any>> = new WeakMap();

export function getNativeSlot(avmValue: AvmValue, slot: typeof NativeSlot.SPRITE): Sprite | undefined;
export function getNativeSlot(avmValue: AvmValue, slot: NativeSlot): any {
  const slots: Map<NativeSlot, any> | undefined = NATIVE_SLOTS.get(avmValue);
  if (slots === undefined) {
    return undefined;
  }
  return slots.get(slot);
}

export function setNativeSlot(avmValue: AvmValue, slot: typeof NativeSlot.SPRITE, slotValue: Sprite): void;
export function setNativeSlot(avmValue: AvmValue, slot: NativeSlot, slotValue: any): any {
  let slots: Map<NativeSlot, any> | undefined = NATIVE_SLOTS.get(avmValue);
  if (slots === undefined) {
    slots = new Map();
    NATIVE_SLOTS.set(avmValue, slots);
  }
  slots.set(slot, slotValue);
}
