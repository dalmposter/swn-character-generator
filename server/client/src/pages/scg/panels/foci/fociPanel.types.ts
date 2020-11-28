import { PanelProps } from "../panels.types";

export interface FociPanelProps extends PanelProps
{
    addFocus: (focusId: number) => void;
    removeFocus: (focusId: number) => void;
    canPlus?: "any" | "combat" | "noncombat";
}

export interface FociPanelState
{
}