import { VoidExpression } from "typescript";

export type BackgroundAvatarProps =
    BackgroundAvatarSmallProps |
    BackgroundAvatarMediumProps |
    BackgroundAvatarLargeProps;

export interface BackgroundAvatarSmallProps
{
    size?: "small";
    id: number;
    style?: React.CSSProperties;
    onAdd?: () => void;
    descriptionMaxHeight?: string;
}

export interface BackgroundAvatarMediumProps
{
    size?: "medium";
    id: number;
    style?: React.CSSProperties;
    onAdd?: () => void;
    descriptionMaxHeight?: string;
}

export interface BackgroundAvatarLargeProps
{
    size?: "large";
    id: number;
    style?: React.CSSProperties;
    onAdd?: () => void;
    descriptionMaxHeight?: string;
    setHeight: (_: string) => void;
    currentHeight: string;
    tableRolls: number;
    shownDesc: boolean;
    setShownDesc?: (_: boolean) => void;
}