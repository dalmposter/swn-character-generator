import React from "react";
import { GameObjectContext } from "../../../pages/scg/Scg.types";
import { PsychicDiscipline } from "../../../types/Object.types";
import { findObjectInMap } from "../../../utility/GameObjectHelpers";
import { PsychicDisciplineAvatarLargeProps, PsychicDisciplineAvatarMediumProps, PsychicDisciplineAvatarProps, PsychicDisciplineAvatarState } from "./psychicDisciplineAvatar.types";
import PsychicPowerAvatar from "./psychicPowerAvatar";
import "./psychicDisciplineAvatar.scss";

export default function PsychicDisciplineAvatar(props: PsychicDisciplineAvatarProps)
{
    return props.size === "large"
        ? <PsychicDisciplineAvatarLarge {...props} />
        : <PsychicDisciplineAvatarMedium {...props} />;
}

/**
 * Render full information about a psychic discipline
 * Including all its powers.
 * Takes an ID and info about what the character has learnt and fetches discipline to render
 */
export class PsychicDisciplineAvatarLarge extends React.Component<
    PsychicDisciplineAvatarLargeProps, PsychicDisciplineAvatarState>
{
    static contextType = GameObjectContext;
    context: React.ContextType<typeof GameObjectContext>;

    /**
     * Make the render for 1 level worth of powers within a discipline
     */
    makePowersLevel(level: number, power_ids: number[])
    {
        return(
            <div key={level}>
                <h3>{`level ${level}:`}</h3>
                <div className="flexbox discipline-powers">
                { power_ids.map((powerId: number) =>
                {
                    return(
                    <div key={powerId} className="flex grow power-container">
                        <PsychicPowerAvatar
                            id={powerId}
                            owned={
                                this.props.knownSkillIds.includes(powerId)
                                ? true
                                : false
                            }
                            unavailable={
                                this.props.level >= level
                                ? null
                                : true
                            }
                            disabled={!(this.props.availablePoints > 0)}
                            addPower={() => this.props.addPower(powerId)}
                            removePower={() => this.props.removePower(powerId)}
                        />
                    </div>);
                })}
                </div>
            </div>
        );
    }

    /**
     * Make the render for all levels of this discipline
     */
    makePowersList(discipline: PsychicDiscipline)
    {
        if(!discipline.powers || discipline.powers.size === 0) return [];
        let out = new Array(discipline.powers.size-1);
        let coreSkill;

        discipline.powers.forEach((power_ids: number[], level: number) =>
        {
            if(level !== 0) out[level-1] = this.makePowersLevel(level, power_ids);
            else coreSkill = this.makeCoreSkill(power_ids.length > 0? power_ids[0] : -1);
        });

        return (
            <div className="flexbox">
                <div className="flex grow PsychicList">
                    {coreSkill}
                    {out}
                </div>
            </div>
        );
    }

    /**
     * Make render of this disciplines core (level 0) skill
     */
    makeCoreSkill(powerId: number)
    {
        return(
        <div>
            <h3 style={{margin: "8px 0"}}>Core Skill (automatically owned):</h3>
            <div className="power-container">
                <PsychicPowerAvatar id={powerId} isCore />
            </div>
        </div>);
    }

    render()
    {
        const discipline: PsychicDiscipline = findObjectInMap(this.props.id, this.context.psychicDisciplines);

        return (
            <div className="Discipline Avatar padding-8" style={this.props.style}>
                <div style={{float: "right"}}>
                    <button onClick={this.props.upLevel}>+</button>
                    <button onClick={this.props.downLevel}>-</button>
                    <button onClick={this.props.removeDiscipline}>Remove</button>
                </div>
                <h2 style={{margin: "4px 0"}}>
                    {`${discipline.name} - Level ${this.props.level}`}
                </h2>
                <p>{ discipline.description }</p>
                { this.makePowersList(discipline) }
            </div>
        ); 
    }
}

/**
 * Render interface for choosing a psychic discipline
 */
export class PsychicDisciplineAvatarMedium extends React.Component<
    PsychicDisciplineAvatarMediumProps, PsychicDisciplineAvatarState>
{
    static contextType = GameObjectContext;
    context: React.ContextType<typeof GameObjectContext>;

    render()
    {
        let discipline: PsychicDiscipline = findObjectInMap(
            this.props.id, this.context.psychicDisciplines);

        return (
            <div className="Discipline Avatar padding-8" style={this.props.style}>
                <button style={{float: "right"}} onClick={this.props.addDiscipline}>
                    Learn (1 point)
                </button>
                <h2>{discipline.name}</h2>
                <p>{discipline.description}</p>
            </div>
        );
    }
}