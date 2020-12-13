export type BackgroundAvatarProps =
    BackgroundAvatarSmallProps |
    BackgroundAvatarMediumProps |
    BackgroundAvatarLargeProps |
    BackgroundAvatarMLCommonProps;

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
    onRef?: (_: any) => void;
    tableRolls: number;
}

export type BackgroundAvatarMLCommonProps = BackgroundAvatarMediumProps | BackgroundAvatarLargeProps;