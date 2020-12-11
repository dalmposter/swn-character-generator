import { PanelProps } from "../panels.types";

export interface PsychicPowersPanelProps extends PanelProps
{
    upDiscipline: (id: number) => void;
    downDiscipline: (id: number) => void;
    addDiscipline: (id: number) => void;
    removeDiscipline: (id: number) => void;
}

export interface PsychicPowersPanelState
{
}