import { createNatSlot, NatSlot } from "avmore/native-slot";
import { Sprite } from "../display/sprite";

export const SPRITE: NatSlot<Sprite> = createNatSlot("[[sprite]]");
