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
    onInspect: () => void;
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
    confirmed: boolean;
    setConfirmed: (quickSkills: number[], freeSkillId: number) => void;
    shownDesc: boolean;
    setShownDesc?: (_: boolean) => void;
    isQuick: boolean;
    setQuick: (_: boolean) => void;
    rolledSkillIds: number[];
    setRolledSkillIds: (_:number[]) => void;
}