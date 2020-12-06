import React from "react";
import { GameObjectContext } from "../../../pages/scg/Scg.types";
import { PsychicDiscipline } from "../../../types/Object.types";
import { findById, findObjectInList } from "../../../utility/GameObjectHelpers";
import { PsychicDisciplineAvatarProps, PsychicDisciplineAvatarState } from "./psychicDisciplineAvatar.types";

export default function PsychicDisciplineAvatar(props: PsychicDisciplineAvatarProps)
{
    return props.id
        ? <PsychicDisciplineAvatarDisplay {...props} />
        : <PsychicDisciplineAvatarChoose {...props} />;
}

export class PsychicDisciplineAvatarDisplay extends React.Component<PsychicDisciplineAvatarProps, PsychicDisciplineAvatarState>
{
    static contextType = GameObjectContext;

    render()
    {
        const discipline: PsychicDiscipline = findObjectInList(this.context.psychicDisciplines, findById(this.props.id));

        return (
            <div className="Discipline Avatar">
                <h2>{discipline.name}</h2>
            </div>
        ); 
    }
}

export class PsychicDisciplineAvatarChoose extends React.Component<PsychicDisciplineAvatarProps, PsychicDisciplineAvatarState>
{
    static contextType = GameObjectContext;

    render()
    {
        return (
            <div className="Discipline Avatar">

            </div>
        );
    }
}