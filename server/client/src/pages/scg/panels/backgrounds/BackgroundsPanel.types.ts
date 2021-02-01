import { PanelProps } from "../panels.types";

export interface BackgroundsPanelProps extends PanelProps
{
    setBackground: (_: number) => void;
    tableRolls: number;
}

export interface BackgroundsPanelState
{
    selectedAvatar: any;
}