import React, { Component } from "react";
import { PsychicPowersPanelProps, PsychicPowersPanelState } from "./psychicPowers.types";
import "../panels.scss";
import "./psychicPowers.scss";
import { CharacterContext, CharacterPsychic, GameObjectContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import PsychicDisciplineAvatar from "../../../../components/avatars/psychics/psychicDisciplineAvatar";


/*
    Panel for choosing character background
    Renders a list of small background avatars next to a large avatar of the selected background
    Also an attribute bonuses section for applying earned bonuses
*/
export default class PsychicPowersPanel extends Component<PsychicPowersPanelProps, PsychicPowersPanelState>
{
    /**
     * Create large avatars for given disciplines
     */
    makeDisciplineAvatars(ids: Map<number, CharacterPsychic>, points: number)
    {
        let makeAvatar = (id: number = -1, level: number = 0, knownSkillIds: number[] = []) => 
        <div className="flex grow" style={{margin: "4px"}} key={id}>
            <PsychicDisciplineAvatar
                id={id}
                level={level}
                knownSkillIds={knownSkillIds}
                upLevel={() => this.props.upDiscipline(id)}
                downLevel={() => this.props.downDiscipline(id)}
                removeDiscipline={() => this.props.removeDiscipline(id)}
                availablePoints={points}
                size="large"
                addPower={ (powerId: number) => this.props.addPower(id, powerId)}
                removePower={ (powerId: number) => this.props.removePower(id, powerId)}
            />
        </div>

        let out = [];
        ids.forEach((value: CharacterPsychic, id: number) =>
            out.push(makeAvatar(id, value.level, value.knownSkills)));

        return out;
    }

    makeAvailableAvatars(ids: number[], addDiscipline: (_: number) => void,
        disabled: boolean = false)
    {
        return ids.map((id: number) =>
            <div style={{margin: "8px 0"}} key={id}>
                <PsychicDisciplineAvatar
                    id={id}
                    addDiscipline={() => addDiscipline(id)}
                    style={{margin: "8px 0"}}
                    size="medium"
                />
            </div>
        );
    }

    render() {
        return (
        <CharacterContext.Consumer>
        { characterContext =>
            <GameObjectContext.Consumer>
            { gameObjects =>
                <div className="Psychic Panel">
                    <PanelHeader {...this.props} />
                    <h1>Psychic Powers</h1>
                    <h2>{`Available points: ${characterContext.character.skills.availablePoints.any}`}</h2>
                    <div className="flexbox column">
                        { this.makeDisciplineAvatars(
                            characterContext.character.psychics,
                            characterContext.character.skills.availablePoints.any,
                        ) }
                    </div>
                        <h2>Available Psychic Disciplines:</h2>
                    <div>
                        { this.makeAvailableAvatars(
                            [...gameObjects.psychicDisciplines.keys()].filter((val: number) =>
                                !characterContext.character.psychics.has(val)),
                            this.props.addDiscipline,
                            !(characterContext.character.skills.availablePoints.any > 0),
                        ) }
                    </div>
                </div>
            }
            </GameObjectContext.Consumer>
        }
        </CharacterContext.Consumer>
        );
    }
}