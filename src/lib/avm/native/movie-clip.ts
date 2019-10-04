import { AVM_UNDEFINED, AvmObject, AvmPropDescriptor, AvmSimpleObject, AvmUndefined, AvmValue, AvmValueType } from "avmore/avm-value";
import { CallableType } from "avmore/function";
import { getNatSlot } from "avmore/native-slot";
import { bindingFromHostFunction } from "avmore/realm";
import { CoreRealm } from "avmore/realm/core";
import { Uint32 } from "semantic-types";
import { Sprite } from "../../display/sprite";
import { SPRITE } from "../slots";
import { NatCallContext } from "avmore/context";

export interface MovieClipRealm {
  movieClip: AvmSimpleObject;
  movieClipPrototype: AvmSimpleObject;
  movieClipPrototypeAttachAudio: AvmObject;
  movieClipPrototypeAttachBitmap: AvmObject;
  movieClipPrototypeAttachMovie: AvmObject;
  movieClipPrototypeBeginBitmapFill: AvmObject;
  movieClipPrototypeBeginFill: AvmObject;
  movieClipPrototypeBeginGradientFill: AvmObject;
  movieClipPrototypeClear: AvmObject;
  movieClipPrototypeCreateEmptyMovieClip: AvmObject;
  movieClipPrototypeCreateTextField: AvmObject;
  movieClipPrototypeCurveTo: AvmObject;
  movieClipPrototypeDuplicateMovieClip: AvmObject;
  movieClipPrototypeEndFill: AvmObject;
  movieClipPrototypeGetBounds: AvmObject;
  movieClipPrototypeGetBytesLoaded: AvmObject;
  movieClipPrototypeGetBytesTotal: AvmObject;
  movieClipPrototypeGetDepth: AvmObject;
  movieClipPrototypeGetInstanceAtDepth: AvmObject;
  movieClipPrototypeGetNextHighestDepth: AvmObject;
  movieClipPrototypeGetRect: AvmObject;
  movieClipPrototypeGetSWFVersion: AvmObject;
  movieClipPrototypeGetTextSnapshot: AvmObject;
  movieClipPrototypeGetURL: AvmObject;
  movieClipPrototypeGlobalToLocal: AvmObject;
  movieClipPrototypeGotoAndPlay: AvmObject;
  movieClipPrototypeGotoAndStop: AvmObject;
  movieClipPrototypeHitTest: AvmObject;
  movieClipPrototypeLineGradientStyle: AvmObject;
  movieClipPrototypeLineStyle: AvmObject;
  movieClipPrototypeLineTo: AvmObject;
  movieClipPrototypeLoadMovie: AvmObject;
  movieClipPrototypeLoadVariables: AvmObject;
  movieClipPrototypeLocalToGlobal: AvmObject;
  movieClipPrototypeMoveTo: AvmObject;
  movieClipPrototypeNextFrame: AvmObject;
  movieClipPrototypePlay: AvmObject;
  movieClipPrototypePrevFrame: AvmObject;
  movieClipPrototypeRemoveMovieClip: AvmObject;
  movieClipPrototypeSetMask: AvmObject;
  movieClipPrototypeStartDrag: AvmObject;
  movieClipPrototypeStop: AvmObject;
  movieClipPrototypeStopDrag: AvmObject;
  movieClipPrototypeSwapDepths: AvmObject;
  movieClipPrototypeUnloadMovie: AvmObject;
}

export function createMovieClipRealm(core: CoreRealm): MovieClipRealm {
  // tslint:disable:max-line-length
  const _movieClipPrototypeAttachAudio: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeAttachAudio);
  const _movieClipPrototypeAttachBitmap: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeAttachBitmap);
  const _movieClipPrototypeAttachMovie: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeAttachMovie);
  const _movieClipPrototypeBeginBitmapFill: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeBeginBitmapFill);
  const _movieClipPrototypeBeginFill: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeBeginFill);
  const _movieClipPrototypeBeginGradientFill: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeBeginGradientFill);
  const _movieClipPrototypeClear: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeClear);
  const _movieClipPrototypeCreateEmptyMovieClip: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeCreateEmptyMovieClip);
  const _movieClipPrototypeCreateTextField: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeCreateTextField);
  const _movieClipPrototypeCurveTo: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeCurveTo);
  const _movieClipPrototypeDuplicateMovieClip: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeDuplicateMovieClip);
  const _movieClipPrototypeEndFill: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeEndFill);
  const _movieClipPrototypeGetBounds: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGetBounds);
  const _movieClipPrototypeGetBytesLoaded: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGetBytesLoaded);
  const _movieClipPrototypeGetBytesTotal: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGetBytesTotal);
  const _movieClipPrototypeGetDepth: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGetDepth);
  const _movieClipPrototypeGetInstanceAtDepth: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGetInstanceAtDepth);
  const _movieClipPrototypeGetNextHighestDepth: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGetNextHighestDepth);
  const _movieClipPrototypeGetRect: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGetRect);
  const _movieClipPrototypeGetSWFVersion: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGetSWFVersion);
  const _movieClipPrototypeGetTextSnapshot: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGetTextSnapshot);
  const _movieClipPrototypeGetURL: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGetURL);
  const _movieClipPrototypeGlobalToLocal: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGlobalToLocal);
  const _movieClipPrototypeGotoAndPlay: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGotoAndPlay);
  const _movieClipPrototypeGotoAndStop: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeGotoAndStop);
  const _movieClipPrototypeHitTest: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeHitTest);
  const _movieClipPrototypeLineGradientStyle: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeLineGradientStyle);
  const _movieClipPrototypeLineStyle: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeLineStyle);
  const _movieClipPrototypeLineTo: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeLineTo);
  const _movieClipPrototypeLoadMovie: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeLoadMovie);
  const _movieClipPrototypeLoadVariables: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeLoadVariables);
  const _movieClipPrototypeLocalToGlobal: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeLocalToGlobal);
  const _movieClipPrototypeMoveTo: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeMoveTo);
  const _movieClipPrototypeNextFrame: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeNextFrame);
  const _movieClipPrototypePlay: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypePlay);
  const _movieClipPrototypePrevFrame: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypePrevFrame);
  const _movieClipPrototypeRemoveMovieClip: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeRemoveMovieClip);
  const _movieClipPrototypeSetMask: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeSetMask);
  const _movieClipPrototypeStartDrag: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeStartDrag);
  const _movieClipPrototypeStop: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeStop);
  const _movieClipPrototypeStopDrag: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeStopDrag);
  const _movieClipPrototypeSwapDepths: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeSwapDepths);
  const _movieClipPrototypeUnloadMovie: AvmObject = bindingFromHostFunction(core.functionPrototype, movieClipPrototypeUnloadMovie);
  // tslint:enable

  // MovieClip.prototype
  const movieClipPrototype: AvmSimpleObject = {
    type: AvmValueType.Object,
    external: false,
    class: "Object",
    prototype: core.objectPrototype,
    ownProperties: new Map([
      ["attachAudio", AvmPropDescriptor.data(_movieClipPrototypeAttachAudio)],
      ["attachBitmap", AvmPropDescriptor.data(_movieClipPrototypeAttachBitmap)],
      ["attachMovie", AvmPropDescriptor.data(_movieClipPrototypeAttachMovie)],
      ["beginBitmapFill", AvmPropDescriptor.data(_movieClipPrototypeBeginBitmapFill)],
      ["beginFill", AvmPropDescriptor.data(_movieClipPrototypeBeginFill)],
      ["beginGradientFill", AvmPropDescriptor.data(_movieClipPrototypeBeginGradientFill)],
      ["clear", AvmPropDescriptor.data(_movieClipPrototypeClear)],
      ["createEmptyMovieClip", AvmPropDescriptor.data(_movieClipPrototypeCreateEmptyMovieClip)],
      ["createTextField", AvmPropDescriptor.data(_movieClipPrototypeCreateTextField)],
      ["curveTo", AvmPropDescriptor.data(_movieClipPrototypeCurveTo)],
      ["duplicateMovieClip", AvmPropDescriptor.data(_movieClipPrototypeDuplicateMovieClip)],
      ["endFill", AvmPropDescriptor.data(_movieClipPrototypeEndFill)],
      ["getBounds", AvmPropDescriptor.data(_movieClipPrototypeGetBounds)],
      ["getBytesLoaded", AvmPropDescriptor.data(_movieClipPrototypeGetBytesLoaded)],
      ["getBytesTotal", AvmPropDescriptor.data(_movieClipPrototypeGetBytesTotal)],
      ["getDepth", AvmPropDescriptor.data(_movieClipPrototypeGetDepth)],
      ["getInstanceAtDepth", AvmPropDescriptor.data(_movieClipPrototypeGetInstanceAtDepth)],
      ["getNextHighestDepth", AvmPropDescriptor.data(_movieClipPrototypeGetNextHighestDepth)],
      ["getRect", AvmPropDescriptor.data(_movieClipPrototypeGetRect)],
      ["getSWFVersion", AvmPropDescriptor.data(_movieClipPrototypeGetSWFVersion)],
      ["getTextSnapshot", AvmPropDescriptor.data(_movieClipPrototypeGetTextSnapshot)],
      ["getURL", AvmPropDescriptor.data(_movieClipPrototypeGetURL)],
      ["globalToLocal", AvmPropDescriptor.data(_movieClipPrototypeGlobalToLocal)],
      ["gotoAndPlay", AvmPropDescriptor.data(_movieClipPrototypeGotoAndPlay)],
      ["gotoAndStop", AvmPropDescriptor.data(_movieClipPrototypeGotoAndStop)],
      ["hitTest", AvmPropDescriptor.data(_movieClipPrototypeHitTest)],
      ["lineGradientStyle", AvmPropDescriptor.data(_movieClipPrototypeLineGradientStyle)],
      ["lineStyle", AvmPropDescriptor.data(_movieClipPrototypeLineStyle)],
      ["lineTo", AvmPropDescriptor.data(_movieClipPrototypeLineTo)],
      ["loadMovie", AvmPropDescriptor.data(_movieClipPrototypeLoadMovie)],
      ["loadVariables", AvmPropDescriptor.data(_movieClipPrototypeLoadVariables)],
      ["localToGlobal", AvmPropDescriptor.data(_movieClipPrototypeLocalToGlobal)],
      ["moveTo", AvmPropDescriptor.data(_movieClipPrototypeMoveTo)],
      ["nextFrame", AvmPropDescriptor.data(_movieClipPrototypeNextFrame)],
      ["play", AvmPropDescriptor.data(_movieClipPrototypePlay)],
      ["prevFrame", AvmPropDescriptor.data(_movieClipPrototypePrevFrame)],
      ["removeMovieClip", AvmPropDescriptor.data(_movieClipPrototypeRemoveMovieClip)],
      ["setMask", AvmPropDescriptor.data(_movieClipPrototypeSetMask)],
      ["startDrag", AvmPropDescriptor.data(_movieClipPrototypeStartDrag)],
      ["stop", AvmPropDescriptor.data(_movieClipPrototypeStop)],
      ["stopDrag", AvmPropDescriptor.data(_movieClipPrototypeStopDrag)],
      ["swapDepths", AvmPropDescriptor.data(_movieClipPrototypeSwapDepths)],
      ["unloadMovie", AvmPropDescriptor.data(_movieClipPrototypeUnloadMovie)],
    ]),
    callable: undefined,
  };

  // MovieClip
  const _movieClip: AvmSimpleObject = {
    type: AvmValueType.Object,
    external: false,
    class: "Function",
    prototype: core.functionPrototype,
    ownProperties: new Map([
      ["prototype", AvmPropDescriptor.data(movieClipPrototype)],
    ]),
    callable: {type: CallableType.Host, handler: movieClip},
  };

  movieClipPrototype.ownProperties.set("constructor", AvmPropDescriptor.data(_movieClip));

  return {
    movieClip: _movieClip,
    movieClipPrototype,
    movieClipPrototypeAttachAudio: _movieClipPrototypeAttachAudio,
    movieClipPrototypeAttachBitmap: _movieClipPrototypeAttachBitmap,
    movieClipPrototypeAttachMovie: _movieClipPrototypeAttachMovie,
    movieClipPrototypeBeginBitmapFill: _movieClipPrototypeBeginBitmapFill,
    movieClipPrototypeBeginFill: _movieClipPrototypeBeginFill,
    movieClipPrototypeBeginGradientFill: _movieClipPrototypeBeginGradientFill,
    movieClipPrototypeClear: _movieClipPrototypeClear,
    movieClipPrototypeCreateEmptyMovieClip: _movieClipPrototypeCreateEmptyMovieClip,
    movieClipPrototypeCreateTextField: _movieClipPrototypeCreateTextField,
    movieClipPrototypeCurveTo: _movieClipPrototypeCurveTo,
    movieClipPrototypeDuplicateMovieClip: _movieClipPrototypeDuplicateMovieClip,
    movieClipPrototypeEndFill: _movieClipPrototypeEndFill,
    movieClipPrototypeGetBounds: _movieClipPrototypeGetBounds,
    movieClipPrototypeGetBytesLoaded: _movieClipPrototypeGetBytesLoaded,
    movieClipPrototypeGetBytesTotal: _movieClipPrototypeGetBytesTotal,
    movieClipPrototypeGetDepth: _movieClipPrototypeGetDepth,
    movieClipPrototypeGetInstanceAtDepth: _movieClipPrototypeGetInstanceAtDepth,
    movieClipPrototypeGetNextHighestDepth: _movieClipPrototypeGetNextHighestDepth,
    movieClipPrototypeGetRect: _movieClipPrototypeGetRect,
    movieClipPrototypeGetSWFVersion: _movieClipPrototypeGetSWFVersion,
    movieClipPrototypeGetTextSnapshot: _movieClipPrototypeGetTextSnapshot,
    movieClipPrototypeGetURL: _movieClipPrototypeGetURL,
    movieClipPrototypeGlobalToLocal: _movieClipPrototypeGlobalToLocal,
    movieClipPrototypeGotoAndPlay: _movieClipPrototypeGotoAndPlay,
    movieClipPrototypeGotoAndStop: _movieClipPrototypeGotoAndStop,
    movieClipPrototypeHitTest: _movieClipPrototypeHitTest,
    movieClipPrototypeLineGradientStyle: _movieClipPrototypeLineGradientStyle,
    movieClipPrototypeLineStyle: _movieClipPrototypeLineStyle,
    movieClipPrototypeLineTo: _movieClipPrototypeLineTo,
    movieClipPrototypeLoadMovie: _movieClipPrototypeLoadMovie,
    movieClipPrototypeLoadVariables: _movieClipPrototypeLoadVariables,
    movieClipPrototypeLocalToGlobal: _movieClipPrototypeLocalToGlobal,
    movieClipPrototypeMoveTo: _movieClipPrototypeMoveTo,
    movieClipPrototypeNextFrame: _movieClipPrototypeNextFrame,
    movieClipPrototypePlay: _movieClipPrototypePlay,
    movieClipPrototypePrevFrame: _movieClipPrototypePrevFrame,
    movieClipPrototypeRemoveMovieClip: _movieClipPrototypeRemoveMovieClip,
    movieClipPrototypeSetMask: _movieClipPrototypeSetMask,
    movieClipPrototypeStartDrag: _movieClipPrototypeStartDrag,
    movieClipPrototypeStop: _movieClipPrototypeStop,
    movieClipPrototypeStopDrag: _movieClipPrototypeStopDrag,
    movieClipPrototypeSwapDepths: _movieClipPrototypeSwapDepths,
    movieClipPrototypeUnloadMovie: _movieClipPrototypeUnloadMovie,
  };
}

export function movieClip(ctx: NatCallContext): AvmValue {
  const thisArg: AvmObject | AvmUndefined = ctx.thisArg;
  const sprite: Sprite | undefined = getNatSlot(thisArg, SPRITE);
  if (sprite === undefined) {
    return ctx.throw(AvmValue.fromHostString(`InvalidTarget: Missing slot ${SPRITE.description} for MovieClip`));
  }
  return thisArg;
}

export function movieClipPrototypeAttachAudio(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.attachAudio");
}

export function movieClipPrototypeAttachBitmap(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.attachBitmap");
}

export function movieClipPrototypeAttachMovie(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.attachMovie");
}

export function movieClipPrototypeBeginBitmapFill(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.beginBitmapFill");
}

export function movieClipPrototypeBeginFill(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.beginFill");
}

export function movieClipPrototypeBeginGradientFill(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.beginGradientFill");
}

export function movieClipPrototypeClear(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.clear");
}

export function movieClipPrototypeCreateEmptyMovieClip(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.createEmptyMovieClip");
}

export function movieClipPrototypeCreateTextField(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.createTextField");
}

export function movieClipPrototypeCurveTo(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.curveTo");
}

export function movieClipPrototypeDuplicateMovieClip(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.duplicateMovieClip");
}

export function movieClipPrototypeEndFill(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.endFill");
}

export function movieClipPrototypeGetBounds(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.getBounds");
}

export function movieClipPrototypeGetBytesLoaded(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.getBytesLoaded");
}

export function movieClipPrototypeGetBytesTotal(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.getBytesTotal");
}

export function movieClipPrototypeGetDepth(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.getDepth");
}

export function movieClipPrototypeGetInstanceAtDepth(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.getInstanceAtDepth");
}

export function movieClipPrototypeGetNextHighestDepth(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.getNextHighestDepth");
}

export function movieClipPrototypeGetRect(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.getRect");
}

export function movieClipPrototypeGetSWFVersion(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.getSWFVersion");
}

export function movieClipPrototypeGetTextSnapshot(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.getTextSnapshot");
}

export function movieClipPrototypeGetURL(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.getURL");
}

export function movieClipPrototypeGlobalToLocal(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.globalToLocal");
}

export function movieClipPrototypeGotoAndPlay(ctx: NatCallContext): AvmValue {
  const sprite: Sprite = getNativeSprite(ctx);
  const avmFrame: AvmValue = ctx.getArg(0);
  switch (avmFrame.type) {
    case AvmValueType.Number: {
      const frame1: Uint32 = ctx.toHostUint32(avmFrame);
      const frame0: Uint32 = Math.max(frame1 - 1, 0);
      sprite.gotoAndPlay(frame0);
      break;
    }
    case AvmValueType.String: {
      sprite.gotoAndPlay(avmFrame.value);
      break;
    }
    default: {
      return ctx.throw(AvmValue.fromHostString("NotImplemented: MovieClip.prototype.gotoAndPlay for non string or number arg"));
    }
  }
  return AVM_UNDEFINED;
}

export function movieClipPrototypeGotoAndStop(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.gotoAndStop");
}

export function movieClipPrototypeHitTest(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.hitTest");
}

export function movieClipPrototypeLineGradientStyle(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.lineGradientStyle");
}

export function movieClipPrototypeLineStyle(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.lineStyle");
}

export function movieClipPrototypeLineTo(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.lineTo");
}

export function movieClipPrototypeLoadMovie(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.loadMovie");
}

export function movieClipPrototypeLoadVariables(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.loadVariables");
}

export function movieClipPrototypeLocalToGlobal(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.localToGlobal");
}

export function movieClipPrototypeMoveTo(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.moveTo");
}

export function movieClipPrototypeNextFrame(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.nextFrame");
}

export function movieClipPrototypePlay(ctx: NatCallContext): AvmValue {
  const sprite: Sprite = getNativeSprite(ctx);
  sprite.play();
  return AVM_UNDEFINED;
}

export function movieClipPrototypePrevFrame(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.prevFrame");
}

export function movieClipPrototypeRemoveMovieClip(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.removeMovieClip");
}

export function movieClipPrototypeSetMask(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.setMask");
}

export function movieClipPrototypeStartDrag(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.startDrag");
}

export function movieClipPrototypeStop(ctx: NatCallContext): AvmValue {
  const sprite: Sprite = getNativeSprite(ctx);
  sprite.stop();
  return AVM_UNDEFINED;
}

export function movieClipPrototypeStopDrag(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.stopDrag");
}

export function movieClipPrototypeSwapDepths(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.swapDepths");
}

export function movieClipPrototypeUnloadMovie(ctx: NatCallContext): AvmValue {
  getNativeSprite(ctx);
  throw new Error("NotImplemented: MovieClip.prototype.unloadMovie");
}

function getNativeSprite(ctx: NatCallContext): Sprite {
  const sprite: Sprite | undefined = getNatSlot(ctx.thisArg, SPRITE);
  if (sprite === undefined) {
    return ctx.throw(AvmValue.fromHostString(`InvalidTarget: Missing internal slot ${SPRITE.description} for MovieClip method`));
  }
  return sprite;
}
