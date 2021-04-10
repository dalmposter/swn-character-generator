import { Background } from "../../../../types/Object.types";
import { PanelProps } from "../panels.types";

export interface BackgroundsPanelProps extends PanelProps
{
    tableRolls: number;
}

export interface BackgroundsPanelState
{
    selectedAvatar: any;
    growthCount: number;
    shownDesc: boolean;
    listHeight: string;
    inspectedBg?: Background;
}