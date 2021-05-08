import { Skill } from "../../../../types/Object.types";
import { PanelProps } from "../panels.types";

export interface SkillsPanelProps extends PanelProps
{
}

export interface SkillsPanelState
{
    viewedSkill?: Skill;
    isInspecting: boolean;
}