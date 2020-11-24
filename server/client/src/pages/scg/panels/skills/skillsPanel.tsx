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
export class SkillsPanel extends Component<SkillsPanelProps, SkillsPanelState>
{
    static contextType = CharacterContext;

    // Check whether a skill can be increased in level
    // TODO: account for actual cost formula of skill, not just 1
    canPlus =  (skill: Skill) =>
        this.context.skills.availablePoints.any > 0 ||
            (skill.is_combat
            ? this.context.skills.availablePoints.combat > 0
            : this.context.skills.availablePoints.noncombat > 0)
    
    // Check whether a skill has had points spent on it (it can be reduced)
    canMinus = (skill: Skill) => 
    {
        const earntSkill = this.context.skills.earntSkills.get(skill.id);
        if(earntSkill === undefined) return false;
        return earntSkill.spentPoints
            ? earntSkill.spentPoints.any > 0
                || earntSkill.spentPoints.combat > 0
                || earntSkill.spentPoints.noncombat > 0
            : false
    }

    // Create a table of skills with inputs to learn more and increase or decrease the skill level
    makeSkillsTable(skills: Skill[])
    {
        console.log("Skills", this.context);
        return (
        <div className="flex grow">
            <table className="skill-table">
                <tbody>
                    {skills.map((skill: Skill, index: number) => 
                    <tr>
                        <td>
                            <button className="button tiny">i</button>
                        </td>
                        <td>
                            {skill.name}
                        </td>
                        <td>
                            {this.context.skills.earntSkills.get(skill.id)
                                ? this.context.skills.earntSkills.get(skill.id).level
                                : "-"
                            }
                        </td>
                        <td>
                            <div style={{float: "left"}} className="button tiny">
                                { this.canMinus(skill) && <button className="button tiny">-</button> }
                            </div>
                            <div>
                                { this.canPlus(skill) && <button className="button tiny">+</button> }
                            </div>
                        </td>
                    </tr>)}
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
                <div className="available-points">
                    <div className="flex grow">
                        <h3>{`${this.context.skills.availablePoints.any} any skill`}</h3>
                    </div>
                    <div className="flex grow">
                        <h3>{`${this.context.skills.availablePoints.combat} combat skill`}</h3>
                    </div>
                    <div className="flex grow">
                        <h3>{`${this.context.skills.availablePoints.noncombat} non-combat skill`}</h3>
                    </div>
                </div>
                <div className="flexbox">
                    {this.makeSkillsTable(gameObjects.skills.slice(0, gameObjects.skills.length / 2))}
                    {this.makeSkillsTable(gameObjects.skills.slice(gameObjects.skills.length / 2))}
                </div>
            </div>
        }
        </GameObjectContext.Consumer>
        );
    }
}