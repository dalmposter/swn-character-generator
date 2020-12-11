export interface PsychicDisciplineAvatarLargeProps
{
    id: number;
    level: number;
    knownSkillIds: number[];
    upLevel: () => void;
    downLevel: () => void;
    removeDiscipline: () => void;
    availablePoints?: number;
    size: "large";
    style?: React.CSSProperties;
}

export interface PsychicDisciplineAvatarMediumProps
{
    id: number;
    addDiscipline: () => void;
    disabled?: boolean;
    size: "medium";
    style?: React.CSSProperties;
}

export type PsychicDisciplineAvatarProps = PsychicDisciplineAvatarMediumProps | PsychicDisciplineAvatarLargeProps;

export interface PsychicDisciplineAvatarState
{
    
}