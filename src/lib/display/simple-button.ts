import { Matrix } from "swf-tree/matrix";
import { PlaceObject } from "swf-tree/tags/place-object";
import { ButtonCharacter, CharacterDictionary } from "./character";
import { DisplayObject } from "./display-object";
import { DisplayObjectVisitor } from "./display-object-visitor";
import { Frame } from "./frame";
import { InteractiveObject } from "./interactive-object";
import { DynamicSprite } from "./sprite";

export enum ButtonState {
  Up,
  Down,
  Over,
  HitTest,
}

function instanciateState(dictionary: CharacterDictionary, tags: PlaceObject[]): DisplayObject | undefined {
  if (tags.length === 0) {
    return undefined;
  }
  // TODO: Optimize `length === 1` case
  return new DynamicSprite(dictionary, [new Frame(tags)]);
}

export class SimpleButton extends InteractiveObject {
  matrix?: Matrix;

  readonly character?: ButtonCharacter;
  state: ButtonState;
  // TODO: Use empty sprite instead of undefined when there's no record? (Shumway seems to use an empty sprite)
  upState?: DisplayObject;
  downState?: DisplayObject;
  overState?: DisplayObject;
  hitTestState?: DisplayObject;

  private constructor(character?: ButtonCharacter) {
    super();
    this.character = character;
    this.state = ButtonState.Up;
  }

  static fromCharacter(character: ButtonCharacter, dictionary: CharacterDictionary): SimpleButton {
    const button: SimpleButton = new SimpleButton(character);
    button.upState = instanciateState(dictionary, character.states.up);
    button.downState = instanciateState(dictionary, character.states.down);
    button.overState = instanciateState(dictionary, character.states.over);
    button.hitTestState = instanciateState(dictionary, character.states.hitTest);
    return button;
  }

  nextFrame(isMainLoop: boolean, runScripts: boolean): void {
  }

  visit<R>(visitor: DisplayObjectVisitor<R>): R {
    return visitor.visitSimpleButton(this);
  }
}
