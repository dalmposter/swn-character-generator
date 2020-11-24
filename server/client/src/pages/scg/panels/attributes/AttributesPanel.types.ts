import { AttributeBonus } from "../../../../types/Object.types";
import { Attribute, AttributeMode, AttributeRuleset, CharacterAttributes } from "../../Scg.types";
import { PanelProps } from "../panels.types";

export interface AttributesPanelProps extends PanelProps
{
    mode: string;
    saveAttributes: (attributes: Map<string,number>) => void;
    attributeRuleset: AttributeRuleset;
    setMode: (mode: string) => void;
}

export interface AttributesPanelState
{
    
}