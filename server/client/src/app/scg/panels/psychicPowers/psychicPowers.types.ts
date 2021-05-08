import { PsychicDiscipline } from "../../../../types/Object.types";
import { PanelProps } from "../panels.types";

export interface PsychicPowersPanelProps extends PanelProps
{
    defaultDiscipline: PsychicDiscipline;
}

export interface PsychicPowersPanelState
{
    activeDiscipline: PsychicDiscipline;
}