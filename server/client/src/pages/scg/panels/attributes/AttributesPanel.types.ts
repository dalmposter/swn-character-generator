import { AttributeBonus } from "../../../../types/Object.types";
import { Attribute, AttributeMode, AttributeRuleset, CharacterAttributes } from "../../Scg.types";

export interface AttributesPanelProps
{
    currentAttributes: Map<string,number>;
    mode: string;
    currentBonuses: AttributeBonus[];
    saveAttributes: (attributes: Map<string,number>) => void;
    attributeRuleset: AttributeRuleset;
    setMode: (mode: string) => void;
}

export interface AttributesPanelState
{
}