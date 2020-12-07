import React from "react";
import { GameObjectContext } from "../../../pages/scg/Scg.types";
import { PsychicDiscipline, PsychicPower } from "../../../types/Object.types";
import { findObjectInMap } from "../../../utility/GameObjectHelpers";
import { PsychicDisciplineAvatarProps, PsychicDisciplineAvatarState } from "./psychicDisciplineAvatar.types";
import PsychicPowerAvatar from "./psychicPowerAvatar";

export default function PsychicDisciplineAvatar(props: PsychicDisciplineAvatarProps)
{
    return props.id
        ? <PsychicDisciplineAvatarDisplay {...props} />
        : <PsychicDisciplineAvatarChoose {...props} />;
}

export class PsychicDisciplineAvatarDisplay extends React.Component<PsychicDisciplineAvatarProps, PsychicDisciplineAvatarState>
{
    static contextType = GameObjectContext;
    context: React.ContextType<typeof GameObjectContext>;

    /**
     * Make the render for 1 level worth of powers within a discipline
     */
    makePowersLevel(level: number, powers: PsychicPower[])
    {
        return(
            <div key={level}>
                <div className="discipline-level">
                    <h3>{`level ${level}:`}</h3>
                </div>
                <div className="flexbox discipline-powers">
                { powers.map((power: PsychicPower) =>
                    <PsychicPowerAvatar id={power.id} className="flex grow" />) 
                }
                </div>
            </div>
        );
    }

    /**
     * Make the render for all levels of this discipline
     */
    makePowersList(discipline: PsychicDiscipline)
    {
        if(!discipline.powers) return [];
        let out = new Array(discipline.powers.size);

        discipline.powers.forEach((powers: PsychicPower[], level: number) =>
        {
            if(level === 0) out[level] = this.makeCoreSkill(powers.length > 0? powers[0].id : -1);
            else out[level] = this.makePowersLevel(level, powers);
        });

        return out;
    }

    /**
     * Make render of this disciplines core (level 0) skill
     */
    makeCoreSkill(powerId: number)
    {
        return(
        <div>
            <h3>Core Skill:</h3>
            <PsychicPowerAvatar id={powerId} />
        </div>);
    }

    render()
    {
        const discipline: PsychicDiscipline = findObjectInMap(this.props.id, this.context.psychicDisciplines);

        return (
            <div className="Discipline Avatar">
                <h2>{discipline.name}</h2>
                { this.makePowersList(discipline) }
            </div>
        ); 
    }
}

export class PsychicDisciplineAvatarChoose extends React.Component<PsychicDisciplineAvatarProps, PsychicDisciplineAvatarState>
{
    static contextType = GameObjectContext;
    context: React.ContextType<typeof GameObjectContext>;

    render()
    {
        return (
            <div className="Discipline Avatar">

            </div>
        );
    }
}