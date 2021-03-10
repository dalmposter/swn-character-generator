import { PanelProps } from "../panels.types";

export interface FociPanelProps extends PanelProps
{
    canPlus?: "any" | "combat" | "noncombat";
}

export interface FociPanelState
{
}