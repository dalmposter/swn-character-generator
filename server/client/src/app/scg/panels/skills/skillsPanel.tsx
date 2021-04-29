import React, { Component } from "react";
import { SkillsPanelProps, SkillsPanelState } from "./skillsPanel.types"
import "./skills.scss";
import { CharacterContext, GameObjectContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { Skill } from "../../../../types/object.types";
import { Modal, Button } from "rsuite";

/*
    Panel for choosing character skills
    Render a list of available points to spend
    And a table of available skills with inputs
*/
export default class SkillsPanel extends Component<SkillsPanelProps, SkillsPanelState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    constructor(props)
    {
        super(props);
        this.state = {
            viewedSkill: undefined,
            isInspecting: false,
        }
    }

    // Check whether a skill can be increased in level
    // TODO: account for available skill points
    canPlus =  (skill: Skill) =>
        this.context.character.skills.availableBonuses.any > 0
        || (skill.is_combat
            ? this.context.character.skills.availableBonuses.combat > 0
            : this.context.character.skills.availableBonuses.noncombat > 0)
    
    // Check whether a skill has had points spent on it (it can be reduced)
    canMinus = (skill: Skill) => 
    {
        const earntSkill = this.context.character.skills.earntSkills.get(skill.id);
        if(earntSkill === undefined) return false;
        return earntSkill.spentPoints + earntSkill.spentBonuses > 0
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
                        <button className="button tiny"
                            onClick={() => this.setState({ viewedSkill: skills.get(key), isInspecting: true })}
                        >
                            i
                        </button>
                    </td>
                    <td>
                        {skills.get(key).name}
                    </td>
                    <td>
                        {this.context.character.skills.earntSkills.get(skills.get(key).id)
                            ? this.context.character.skills.earntSkills.get(skills.get(key).id).level
                            : "-"
                        }
                    </td>
                    <td>
                        <div style={{float: "left"}} className="button tiny">
                            { this.canMinus(skills.get(key)) &&
                            <button className="button tiny"
                                onClick={() => this.context.operations.skills.removeBonusSkill(key)}
                            >
                                -
                            </button> }
                        </div>
                        <div>
                            { this.canPlus(skills.get(key)) &&
                            <button className="button tiny"
                                onClick={() => this.context.operations.skills.learnBonusSkill(key)}
                            >
                                +
                            </button> }
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
                <PanelHeader
                    onReset={this.context.operations.skills.resetSkills}
                    onHelp={() => { /* TODO: help modal */ }}
                />
                <h1>Skills</h1>
                <div>
                    <h2 style={{marginBottom: 0, float: "left"}}>Available bonus skills:</h2>
                    <h2 style={{marginBottom: 0, float: "right"}}>Skill points: {this.context.character.skills.skillPoints}</h2>
                </div>
                <div className="available-points">
                    <div className="flex grow">
                        <h3>
                            {`${this.context.character.skills.availableBonuses.any} any skill`}
                        </h3>
                    </div>
                    <div className="flex grow">
                        <h3>{`${this.context.character.skills.availableBonuses.combat} combat skill`}</h3>
                    </div>
                    <div className="flex grow">
                        <h3>{`${this.context.character.skills.availableBonuses.noncombat} non-combat skill`}</h3>
                    </div>
                </div>
                <div className="flexbox">
                    {this.makeSkillsTable(gameObjects.skills, 0, gameObjects.skills.size / 2)}
                    {this.makeSkillsTable(gameObjects.skills, gameObjects.skills.size / 2)}
                </div>
                <Modal show={this.state.isInspecting}
                    onHide={() => this.setState({ isInspecting: false })}
                >
                    <Modal.Header>
                        <Modal.Title>{ this.state.viewedSkill? this.state.viewedSkill.name : "error" }</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.viewedSkill? this.state.viewedSkill.description : "error"}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.setState({ isInspecting: false })}
                            appearance="primary"
                        >
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        }
        </GameObjectContext.Consumer>
        );
    }
}