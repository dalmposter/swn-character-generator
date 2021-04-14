import React from "react";
import { CharacterContext, GameObjectContext } from "../../../pages/scg/Scg.types";
import { PsychicDiscipline } from "../../../types/Object.types";
import { findObjectInMap } from "../../../utility/GameObjectHelpers";
import { PsychicDisciplineAvatarLargeProps, PsychicDisciplineAvatarMediumProps, PsychicDisciplineAvatarProps, PsychicDisciplineAvatarState } from "./psychicDisciplineAvatar.types";
import PsychicPowerAvatar from "./psychicPowerAvatar";
import "./psychicDisciplineAvatar.scss";

export default function PsychicDisciplineAvatar(props: PsychicDisciplineAvatarProps)
{
    return (
        props.size === "large"
            ? <PsychicDisciplineAvatarLarge {...props} />
            : <PsychicDisciplineAvatarMedium {...props} />
    )
}

/**
 * Render full information about a psychic discipline
 * Including all its powers.
 * Takes an ID and info about what the character has learnt and fetches discipline to render
 */
export class PsychicDisciplineAvatarLarge extends React.Component<
    PsychicDisciplineAvatarLargeProps, PsychicDisciplineAvatarState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    /**
     * Make the render for 1 level worth of powers within a discipline
     */
    makePowersLevel(this_level: number, power_ids: number[], cumulativeOwnedPowers: number)
    {
        return(
            <div key={this_level}>
                <h3>{`level ${this_level}:`}</h3>
                <div className="flexbox discipline-powers">
                { power_ids.map((powerId: number) =>
                {
                    return(
                    <div key={powerId} className="flex grow power-container">
                        <PsychicPowerAvatar
                            id={powerId}
                            owned={
                                this.props.knownSkillIds.includes(powerId)
                            }
                            locked={
                                this.props.level >= this_level
                                ? null
                                : true
                            }
                            // The power is unavailable if the user doesn't have any points to spend
                            // Or if they have not earnt enough powers from previous levels
                            // (Players must select 1 power at or below the level of the discipline, for each level of the discipline)
                            // So it is necessary to learn at least 1 level-1 power before earning any level-2 powers
                            // Requires 1 level-1 power plus 1 level-1 or level-2 power before learning any level-3 powers
                            // etc...
                            // The power is also unavailable to deselect if owned if that would break the above rules
                            unavailable={ this.props.knownSkillIds.includes(powerId)
                                ? cumulativeOwnedPowers <= this_level && cumulativeOwnedPowers < this.props.knownSkillIds.length
                                : (this.context.character.skills.availableBonuses.any <= 0
                                        && this.props.freePicks <= 0)
                                    || (this.props.level - this.props.freePicks + 1) < this_level
                            }
                            disabled={
                                !this.props.knownSkillIds.includes(powerId) &&
                                this.props.freePicks <= 0 &&
                                this.context.character.skills.availableBonuses.any <= 0
                            }
                            addPower={() => this.context.operations.psychics
                                .addPower(this.props.discipline.id, powerId)
                            }
                            removePower={() => this.context.operations.psychics
                                .removePower(this.props.discipline.id, powerId)
                            }
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
        let cumulativeOwnedPowers = 0;

        discipline.powers.forEach((power_ids: number[], level: number) =>
        {
            if(level !== 0)
            {
                cumulativeOwnedPowers += this.props.knownSkillIds.filter(power => power_ids.includes(power)).length;
                out[level-1] = this.makePowersLevel(level, power_ids, cumulativeOwnedPowers);
            }
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
            <div className="power-container">
                <PsychicPowerAvatar id={powerId} isCore />
            </div>
        );
    }

    render()
    {
        return (
            <div className="Discipline Avatar padding-8" style={this.props.style}>
                <div style={{float: "right"}}>
                    <button onClick={() => this.context.operations.psychics
                        .upDiscipline(this.props.discipline.id)}
                        disabled={this.context.character.skills.availableBonuses.any +
                            this.context.character.skills.availableBonuses.psychic <= 0}
                    >
                        {`+`}
                    </button>
                    <button onClick={() => this.context.operations.psychics
                        .downDiscipline(this.props.discipline.id)}
                    >
                        {`-`}
                    </button>
                    <button onClick={() => this.context.operations.psychics
                        .removeDiscipline(this.props.discipline.id)}
                    >
                        {`Remove`}
                    </button>
                </div>
                <div className="flexbox">
                    <h2 style={{margin: "4px 0"}} className="flex grow">
                        {`${this.props.discipline.name} - Level ${this.props.level}`}
                    </h2>
                    <h3 style={{margin: "4px 16px 4px 0", textAlign: "right"}} className="flex grow">
                        {`${this.props.freePicks} free technique picks`}
                    </h3>
                </div>
                <div className="power-container">
                    <p>{ this.props.discipline.description }</p>
                </div>
                { this.makePowersList(this.props.discipline) }
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
                <button
                    style={{float: "right"}}
                    onClick={this.props.addDiscipline}
                    disabled={this.props.disabled}
                >
                    Learn (1 point)
                </button>
                <h2>{discipline.name}</h2>
                <p>{discipline.description}</p>
            </div>
        );
    }
}