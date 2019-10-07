import { DisplayObjectContainer as RendererDisplayObjectContainer } from "swf-renderer/display/display-object-container";
import { DisplayObjectType } from "swf-renderer/display/display-object-type";
import { TagType } from "swf-tree";
import { Matrix } from "swf-tree/matrix";
import { PlaceObject } from "swf-tree/tags/place-object";
import { SwfAudioContext } from "../audio/swf-audio-context";
import { Avm1Context } from "../types/avm1-context";
import { ButtonCharacter, CharacterDictionary } from "./character";
import { DisplayObject } from "./display-object";
import { DisplayObjectVisitor } from "./display-object-visitor";
import { InteractiveObject } from "./interactive-object";
import { ChildSprite } from "./sprite";

export enum ButtonState {
  Up,
  Down,
  Over,
  HitTest,
}

function instanciateState(
  dictionary: CharacterDictionary,
  tags: PlaceObject[],
  avm1Ctx: Avm1Context,
  audioCtx: SwfAudioContext,
): DisplayObject | undefined {
  if (tags.length === 0) {
    return undefined;
  }
  const sprite: ChildSprite = ChildSprite.fromButtonState([...tags, {type: TagType.ShowFrame}], dictionary, avm1Ctx, audioCtx);
  return sprite;
}

export class SimpleButton extends InteractiveObject implements RendererDisplayObjectContainer {
  // TODO: Refactor `type` and `children` (quick hacks for `swf-renderer@0.0.1` without button support)
  type: DisplayObjectType.Container;
  children: DisplayObject[];

  matrix?: Matrix;

  readonly character?: ButtonCharacter;
  state: ButtonState;
  oldState: ButtonState | undefined;
  // TODO: Use empty sprite instead of undefined when there's no record? (Shumway seems to use an empty sprite)
  upState?: DisplayObject;
  downState?: DisplayObject;
  overState?: DisplayObject;
  hitTestState?: DisplayObject;

  private constructor(character?: ButtonCharacter) {
    super();
    this.type = DisplayObjectType.Container;
    this.children = [];
    this.character = character;
    this.state = ButtonState.Up;
  }

  static fromCharacter(
    character: ButtonCharacter,
    dictionary: CharacterDictionary,
    avm1Ctx: Avm1Context,
    audioCtx: SwfAudioContext,
  ): SimpleButton {
    const button: SimpleButton = new SimpleButton(character);
    button.upState = instanciateState(dictionary, character.states.up, avm1Ctx, audioCtx);
    button.downState = instanciateState(dictionary, character.states.down, avm1Ctx, audioCtx);
    button.overState = instanciateState(dictionary, character.states.over, avm1Ctx, audioCtx);
    button.hitTestState = instanciateState(dictionary, character.states.hitTest, avm1Ctx, audioCtx);
    return button;
  }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {
    if (this.state !== this.oldState) {
      this.oldState = this.state;
      this.children.length = 0;
      switch (this.state) {
        case ButtonState.Up: {
          if (this.upState !== undefined) {
            this.children.push(this.upState);
          }
          break;
        }
        case ButtonState.Down: {
          if (this.downState !== undefined) {
            this.children.push(this.downState);
          }
          break;
        }
        case ButtonState.Over: {
          if (this.overState !== undefined) {
            this.children.push(this.overState);
          }
          break;
        }
        case ButtonState.HitTest: {
          if (this.hitTestState !== undefined) {
            this.children.push(this.hitTestState);
          }
          break;
        }
        default: {
          throw new Error("AssertionError: UnexpectedButtonState");
        }
      }
    }
    if (this.children.length > 0) {
      this.children[0].nextFrame(isMainLoop, runScripts);
    }
  }

  visit<R>(visitor: DisplayObjectVisitor<R>): R {
    return visitor.visitSimpleButton(this);
  }
}
