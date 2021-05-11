import { AttributeMode, AttributeRuleset } from "../../../../types/ruleset.types";
import { PanelProps } from "../panels.types";

export interface AttributesPanelProps extends PanelProps
{
    attributeRuleset: AttributeRuleset;
    modifiers: Map<number, number>;
    defaultMode: AttributeMode;
}

export interface AttributesPanelState
{
    mode: AttributeMode;
    allocateOptions: number[];
    canAllocate: boolean;
    canRoll: boolean;
}