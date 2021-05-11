import React from "react";
import { CharacterContext } from "../../../scg/Scg.types";
import { PsychicDiscipline } from "../../../../types/Object.types";
import { PsychicDisciplineAvatarProps, PsychicDisciplineAvatarState, PsychicDisciplineHeaderProps } from "./psychicDisciplineAvatar.types";
import PsychicPowerAvatar from "./psychicPowerAvatar";
import "./psychicDisciplineAvatar.scss";
import { Panel } from "rsuite";

export class PsychicDisciplineHeader extends React.Component<
PsychicDisciplineHeaderProps, PsychicDisciplineAvatarState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    render()
    {
        return(
            <div className="flexbox">
                <div className="flex grow flex flexbox">
                    <h2 className="flex grow no-margin"
                        style={{maxWidth: "240px", minWidth: "max-content"}}>
                        {this.props.discipline.name}{this.props.level >= 0 && ` - Level ${this.props.level}`}
                    </h2>
                    { /*
                        If this discipline is open or learnt, display how many free picks are remaining
                            or a message saying the discipline is not learnt
                        Otherwise display a truncated (if necessary) description of the discipline
                    */ }
                    { this.props.freePicks !== undefined &&
                        <h3 className="Discipline description"
                            style={{color: this.props.freePicks > 0? "#116e09" : "#730f22"}}
                        >
                            {`${this.props.freePicks} free powers`}
                        </h3>
                    }  
                    { (!this.props.active && this.props.level < 0) &&
                        <p className="Discipline description">
                            {this.props.discipline.description}
                        </p>
                    }
                    { (this.props.active && this.props.freePicks === undefined) &&
                        <h3 className="Discipline description" style={{color: "#730f22"}}>
                            Not currently learnt
                        </h3>

                    }
                </div>
                <div className="flex" style={{minWidth: "max-content", margin: "auto"}}>
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            this.context.operations.psychics.downDiscipline(this.props.discipline.id);
                        }}
                        disabled={this.props.level < 0}
                    >
                        {`-`}
                    </button>
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            this.context.operations.psychics.upDiscipline(this.props.discipline.id);
                        }}
                        disabled={this.context.character.skills.availableBonuses.any +
                            this.context.character.skills.availableBonuses.psychic <= 0}
                    >
                        {`+`}
                    </button>
                    <button
                        style={{marginLeft: "6px"}}
                        onClick={e => {
                            e.stopPropagation();
                            this.context.operations.psychics.removeDiscipline(this.props.discipline.id);
                        }}
                        disabled={this.props.level < 0}
                    >
                        {`x`}
                    </button>
                </div>
            </div>
        );
    }
}

export class PsychicDisciplineBody extends React.Component<
    PsychicDisciplineAvatarProps, PsychicDisciplineAvatarState>
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
                <h3 style={{marginBottom: "2px"}}>{`level ${this_level}:`}</h3>
                <div className="flexbox discipline-powers">
                { power_ids.map((powerId: number) =>
                { return(
                    <div key={powerId} className="flex grow power-container"> {
                    this.props.level < 0
                        ? <PsychicPowerAvatar
                                id={powerId}
                                nonInteractable={true}
                            />
                        : <PsychicPowerAvatar
                                id={powerId}
                                owned={this.props.knownSkillIds.includes(powerId)}
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
                                unavailable={
                                    this.props.knownSkillIds.includes(powerId)
                                        ? cumulativeOwnedPowers <= this_level && cumulativeOwnedPowers < this.props.knownSkillIds.length
                                        : (this.context.character.skills.availableBonuses.any <= 0 && this.props.freePicks <= 0)
                                            || ((this.props.level - this.props.freePicks + 1) < this_level)
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
                    } </div>);
                })}
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
                <PsychicPowerAvatar id={powerId} isCore owned={this.props.level >= 0} />
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
                if(this.props.knownSkillIds)
                    cumulativeOwnedPowers += this.props.knownSkillIds
                    .filter(power => power_ids.includes(power)).length;
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

    render()
    {
        return (<>
            <div className="power-container">
                <p style={{ marginTop: 0 }}>{ this.props.discipline.description }</p>
            </div>
            {this.makePowersList(this.props.discipline)}
        </>);
    }
}

/**
 * Render full information about a psychic discipline
 * Including all its powers.
 * Takes an ID and info about what the character has learnt and fetches discipline to render
 */
export default class PsychicDisciplineAvatar extends React.Component<
    PsychicDisciplineAvatarProps, PsychicDisciplineAvatarState>
{
    render()
    {
        return (
            <Panel className="Discipline Avatar"
                collapsible
                style={this.props.style}
                header={<PsychicDisciplineHeader {...this.props} />}
            >
                {<PsychicDisciplineBody {...this.props} />}
            </Panel>
        ); 
    }
}