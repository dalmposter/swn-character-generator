import { AttributeMode, AttributeRuleset } from "../../ruleset.types";
import { PanelProps } from "../panels.types";

export interface AttributesPanelProps extends PanelProps
{
    attributeRuleset: AttributeRuleset;
    defaultMode?: string;
    modifiers: Map<number, number>;
}

export interface AttributesPanelState
{
    mode: AttributeMode;
    allocateOptions: number[];
    canAllocate: boolean;
    canRoll: boolean;
    canModify: boolean;
}