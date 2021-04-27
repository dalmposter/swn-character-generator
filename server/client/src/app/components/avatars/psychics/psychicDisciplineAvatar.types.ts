import { PsychicDiscipline } from "../../../../types/object.types";

export interface PsychicDisciplineAvatarProps extends PsychicDisciplineCommonProps
{
    knownSkillIds?: number[];
};

export interface PsychicDisciplineHeaderProps extends PsychicDisciplineCommonProps
{
    active?: boolean;
}

interface PsychicDisciplineCommonProps
{
    discipline: PsychicDiscipline;
    level: number;
    freePicks?: number;
    style?: React.CSSProperties;
}

export interface PsychicDisciplineAvatarState
{
};