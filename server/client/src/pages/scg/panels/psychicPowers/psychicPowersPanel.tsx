import React, { Component } from "react";
import { PsychicPowersPanelProps, PsychicPowersPanelState } from "./psychicPowers.types";
import "../panels.scss";
import "./psychicPowers.scss";
import { CharacterContext, GameObjectContext, GameObjectsContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import PsychicDisciplineAvatar from "../../../../components/avatars/psychics/psychicDisciplineAvatar";
import { CharacterPsychic } from "../../character.types";
import { PsychicDiscipline } from "../../../../types/Object.types";
import { findObjectInMap } from "../../../../utility/GameObjectHelpers";


/*
    Panel for choosing character background
    Renders a list of small background avatars next to a large avatar of the selected background
    Also an attribute bonuses section for applying earned bonuses
*/
export default class PsychicPowersPanel extends Component<PsychicPowersPanelProps, PsychicPowersPanelState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    /**
     * Create large avatars for given disciplines
     */
    makeDisciplineAvatars(ids: Map<number, CharacterPsychic>, gameObjectContext: GameObjectsContext)
    {
        let makeAvatar = (id: number = -1, level: number = 0, knownSkillIds: number[] = [], unspentPoints = 0) =>
        {
            let discipline: PsychicDiscipline = findObjectInMap(
                id, gameObjectContext.psychicDisciplines);
            
            return (
                <div className="flex grow" style={{margin: "4px"}} key={id}>
                    <PsychicDisciplineAvatar
                        discipline={discipline}
                        level={level}
                        knownSkillIds={knownSkillIds}
                        freePicks={unspentPoints}
                        size="large"
                    />
                </div>
            );
        }

        let out = [];
        ids.forEach((value: CharacterPsychic, id: number) =>
            out.push(makeAvatar(id, value.level, value.knownTechniques, value.freePicks)));

        return out;
    }

    makeAvailableAvatars(ids: number[])
    {
        return ids.map((id: number) =>
            <div style={{margin: "8px 0"}} key={id}>
                <PsychicDisciplineAvatar
                    id={id}
                    addDiscipline={() => this.context.operations.psychics.upDiscipline(id)}
                    style={{margin: "8px 0"}}
                    size="medium"
                    disabled={
                        this.context.character.skills.availableBonuses.any + 
                        this.context.character.skills.availableBonuses.psychic <= 0
                    }
                />
            </div>
        );
    }

    render() {
        return (
        <GameObjectContext.Consumer>
        { gameObjects =>
            <div className="Psychic Panel">
                <PanelHeader {...this.props} />
                <h1 style={{marginBottom: "12px"}}>Psychic Powers</h1>
                <div className="flexbox padding-8">
                    <h2 className="flex grow">
                    {`Available bonus skill picks: ${this.context.character.skills.availableBonuses.any}`}
                    </h2>
                    <h2>
                    {`Free discipline picks: ${this.context.character.skills.availableBonuses.psychic}`}
                    </h2>
                </div>
                <div className="flexbox column">
                    { this.makeDisciplineAvatars(
                        this.context.character.psychics,
                        gameObjects
                    ) }
                </div>
                    <h2>Available Psychic Disciplines:</h2>
                <div>
                    { this.makeAvailableAvatars(
                        [...gameObjects.psychicDisciplines.keys()].filter((val: number) =>
                            !this.context.character.psychics.has(val)),
                    ) }
                </div>
            </div>
        }
        </GameObjectContext.Consumer>
        );
    }
}