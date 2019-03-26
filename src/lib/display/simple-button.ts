import { DisplayObjectType } from "swf-renderer/display/display-object-type";
import { Matrix } from "swf-tree/matrix";
import { PlaceObject } from "swf-tree/tags/place-object";
import { Avm1Context } from "../types/avm1-context";
import { ButtonCharacter, CharacterDictionary } from "./character";
import { DisplayObject } from "./display-object";
import { DisplayObjectBase } from "./display-object-base";
import { DisplayObjectVisitor } from "./display-object-visitor";
import { Frame } from "./frame";
import { InteractiveObject } from "./interactive-object";

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
): DisplayObjectBase | undefined {
  if (tags.length === 0) {
    return undefined;
  }
  // TODO: Optimize `length === 1` case
  return null as any; // new DynamicSprite(dictionary, [new Frame(tags)], avm1Ctx);
}

export class SimpleButton extends InteractiveObject {
  // TODO: Refactor `type` and `children` (quick hacks for `swf-renderer@0.0.1` without button support)
  type: DisplayObjectType.Container;
  children: DisplayObject[];

  matrix?: Matrix;

  readonly character?: ButtonCharacter;
  state: ButtonState;
  // TODO: Use empty sprite instead of undefined when there's no record? (Shumway seems to use an empty sprite)
  upState?: DisplayObjectBase;
  downState?: DisplayObjectBase;
  overState?: DisplayObjectBase;
  hitTestState?: DisplayObjectBase;

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
  ): SimpleButton {
    const button: SimpleButton = new SimpleButton(character);
    button.upState = instanciateState(dictionary, character.states.up, avm1Ctx);
    button.downState = instanciateState(dictionary, character.states.down, avm1Ctx);
    button.overState = instanciateState(dictionary, character.states.over, avm1Ctx);
    button.hitTestState = instanciateState(dictionary, character.states.hitTest, avm1Ctx);
    return button;
  }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {
  }

  visit<R>(visitor: DisplayObjectVisitor<R>): R {
    return visitor.visitSimpleButton(this);
  }
}
