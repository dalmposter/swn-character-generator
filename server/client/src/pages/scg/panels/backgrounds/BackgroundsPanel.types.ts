import { AttributeBonus, Background } from "../../../../types/Object.types";
import { BackgroundRuleset } from "../../Scg.types";
import { PanelProps } from "../panels.types";

export interface BackgroundsPanelProps extends PanelProps
{
    fetchBackgrounds: () => void;
    currentBonuses: AttributeBonus[];
    setBackground: (_: number) => void;
    tableRolls: number;
}

export interface BackgroundsPanelState
{
    selectedAvatar: any;
}