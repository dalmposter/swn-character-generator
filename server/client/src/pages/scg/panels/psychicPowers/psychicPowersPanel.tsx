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
    makeDisciplineAvatars(ids: Map<number, CharacterPsychic>, points: number, upDiscipline: (id: number) => void,
        downDiscipline: (id: number) => void, removeDiscipline: (id: number) => void)
    {
        console.log("ids:", ids);

        let makeAvatar = (id: number = -1, level: number = 0, knownSkillIds: number[] = []) => 
        <div className="flex grow" style={{margin: "4px"}}>
            <PsychicDisciplineAvatar
                id={id}
                level={level}
                knownSkillIds={knownSkillIds}
                upLevel={() => upDiscipline(id)}
                downLevel={() => downDiscipline(id)}
                removeDiscipline={() => removeDiscipline(id)}
                availablePoints={points}
                size="large"
            />
        </div>

        let out = [];
        ids.forEach((value: CharacterPsychic, id: number) =>
            out.push(makeAvatar(id, value.level, value.knownSkills)));
        //while(ids.size < this.props.maxDisciplines) out.push(makeAvatar());

        return out;
    }

    makeAvailableAvatars(ids: number[], addDiscipline: (_: number) => void,
        disabled: boolean = false)
    {
        return ids.map((id: number) =>
            <div style={{margin: "8px 0"}}>
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
        { character =>
            <GameObjectContext.Consumer>
            { gameObjects =>
                <div className="Psychic Panel">
                    <PanelHeader {...this.props} />
                    <h1>Psychic Powers</h1>
                    <h2>{`Available points: ${character.skills.availablePoints.any}`}</h2>
                    <div className="flexbox column">
                        { this.makeDisciplineAvatars(
                            character.psychics,
                            character.skills.availablePoints.any,
                            this.props.upDiscipline,
                            this.props.downDiscipline,
                            this.props.removeDiscipline,
                        ) }
                    </div>
                        <h2>Available Psychic Disciplines:</h2>
                    <div>
                        { this.makeAvailableAvatars(
                            [...gameObjects.psychicDisciplines.keys()].filter((val: number) =>
                                !character.psychics.has(val)),
                            this.props.addDiscipline,
                            !(character.skills.availablePoints.any > 0),
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