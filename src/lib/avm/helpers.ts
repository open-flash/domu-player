import { Avm } from "./avm";
import {
  AVM_UNDEFINED, AvmCallResult, AvmNativeFunction, AvmString, AvmValue, AvmValueType,
  NativeCallHandler,
} from "./avm-value";

export function getArgs(argCount: 1, args: AvmValue[]): [AvmValue];
export function getArgs(argCount: 2, args: AvmValue[]): [AvmValue, AvmValue];
export function getArgs(argCount: 3, args: AvmValue[]): [AvmValue, AvmValue, AvmValue];
export function getArgs(argCount: number, args: AvmValue[]): AvmValue[];
export function getArgs(argCount: any, args: any): any {
  const result: AvmValue[] = [];
  for (let i: number = 0; i < argCount; i++) {
    result.push(i < args.length ? args[i] : AVM_UNDEFINED);
  }
  return result;
}

export function nativeFunction(handler: NativeCallHandler): AvmNativeFunction {
  return {
    type: AvmValueType.Function,
    native: true,
    handler,
  };
}

export function returnValue(value: AvmValue): AvmCallResult {
  return [true, value];
}

export function throwValue(value: AvmValue): AvmCallResult {
  return [false, value];
}

export function string(value: string): AvmString {
  return {type: AvmValueType.String, value};
}
