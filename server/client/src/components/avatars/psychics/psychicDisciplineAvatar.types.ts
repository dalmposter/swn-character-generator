import { PsychicDiscipline } from "../../../types/Object.types";

export interface PsychicDisciplineAvatarLargeProps
{
    //id: number;
    discipline: PsychicDiscipline;
    level: number;
    knownSkillIds: number[];
    freePicks?: number;
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