import React, { Component } from "react";
import { SkillsPanelProps, SkillsPanelState } from "./skillsPanel.types";
import "../panels.scss";
import "./skills.scss";
import { CharacterContext, GameObjectContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { Skill } from "../../../../types/Object.types";

/*
    Panel for choosing character skills
    Render a list of available points to spend
    And a table of available skills with inputs
*/
export default class SkillsPanel extends Component<SkillsPanelProps, SkillsPanelState>
{
    static contextType = CharacterContext;

    // Check whether a skill can be increased in level
    // TODO: account for actual cost formula of skill, not just 1
    canPlus =  (skill: Skill) =>
        (this.context.skills.availablePoints.any +
            this.context.skills.availablePoints.nonpsychic > 0)
        || (skill.is_combat
            ? this.context.skills.availablePoints.combat > 0
            : this.context.skills.availablePoints.noncombat > 0)
    
    // Check whether a skill has had points spent on it (it can be reduced)
    canMinus = (skill: Skill) => 
    {
        const earntSkill = this.context.skills.earntSkills.get(skill.id);
        if(earntSkill === undefined) return false;
        return earntSkill.spentPoints > 0
    }

    // Create a table of skills with inputs to learn more and increase or decrease the skill level
    makeSkillsTable(skills: Map<number, Skill>, startIndex: number = 0, endIndex: number = -1)
    {
        if(endIndex === -1) endIndex = skills.size;
        let out = [];
        const keys = [...skills.keys()];
        // Generate a row for each skill in the given range of skills
        for(let i = Math.ceil(startIndex); i < endIndex; i++)
        {
            const key = keys[i];
            out.push(
                <tr key={key}>
                    <td>
                        <button className="button tiny">i</button>
                    </td>
                    <td>
                        {skills.get(key).name}
                    </td>
                    <td>
                        {this.context.skills.earntSkills.get(skills.get(key).id)
                            ? this.context.skills.earntSkills.get(skills.get(key).id).level
                            : "-"
                        }
                    </td>
                    <td>
                        <div style={{float: "left"}} className="button tiny">
                            { this.canMinus(skills.get(key)) && <button className="button tiny">-</button> }
                        </div>
                        <div>
                            { this.canPlus(skills.get(key)) && <button className="button tiny">+</button> }
                        </div>
                    </td>
                </tr>
            );
        }

        // Wrap those in a table
        return (
        <div className="flex grow">
            <table className="skill-table">
                <tbody>
                    {out}
                </tbody>
            </table>
        </div>
        );
    }

    render() {
        return (
        <GameObjectContext.Consumer>
        { gameObjects => 
            <div className="Skills Panel">
                <PanelHeader {...this.props} />
                <h1>Skills</h1>
                <h2 style={{marginBottom: 0}}>Available skill points:</h2>
                <div className="available-points" style={{backgroundColor: "cadetblue"}}>
                    <div className="flex grow">
                        <h3>
                            {`${this.context.skills.availablePoints.any +
                                this.context.skills.availablePoints.nonpsychic} any skill`}
                        </h3>
                    </div>
                    <div className="flex grow">
                        <h3>{`${this.context.skills.availablePoints.combat} combat skill`}</h3>
                    </div>
                    <div className="flex grow">
                        <h3>{`${this.context.skills.availablePoints.noncombat} non-combat skill`}</h3>
                    </div>
                </div>
                <div className="flexbox">
                    {this.makeSkillsTable(gameObjects.skills, 0, gameObjects.skills.size / 2)}
                    {this.makeSkillsTable(gameObjects.skills, gameObjects.skills.size / 2)}
                </div>
            </div>
        }
        </GameObjectContext.Consumer>
        );
    }
}