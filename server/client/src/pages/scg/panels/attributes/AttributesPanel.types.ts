import { AttributeMode, AttributeRuleset } from "../../Scg.types";
import { PanelProps } from "../panels.types";

export interface AttributesPanelProps extends PanelProps
{
    attributeRuleset: AttributeRuleset;
    defaultMode?: string;
}

export interface AttributesPanelState
{
    mode: AttributeMode;
    allocateOptions: number[];
    canAllocate: boolean;
    canRoll: boolean;
    canModify: boolean;
}