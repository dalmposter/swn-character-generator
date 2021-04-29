import React, { Component } from "react";
import { PsychicPowersPanelProps, PsychicPowersPanelState } from "./psychicPowers.types"
import "./psychicPowers.scss";
import { CharacterContext, GameObjectContext, GameObjectsContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { PsychicDisciplineBody, PsychicDisciplineHeader } from "../../../components/avatars/psychics/psychicDisciplineAvatar";
import { PsychicDiscipline } from "../../../../types/object.types";
import { Panel, PanelGroup } from "rsuite";


/*
    Panel for choosing character background
    Renders a list of small background avatars next to a large avatar of the selected background
    Also an attribute bonuses section for applying earned bonuses
*/
export default class PsychicPowersPanel extends Component<PsychicPowersPanelProps, PsychicPowersPanelState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    constructor(props)
    {
        super(props);
        this.state = {
            activeEventKey: 1,
        }
    }

    /**
     * Create large avatars for given disciplines
     */
    makeDisciplineAvatars(gameObjectContext: GameObjectsContext)
    {
        let makeAvatar = (discipline: PsychicDiscipline, eventKey: number) =>
        {
            if(this.context.character.psychics.has(discipline.id))
            {
                let characterDiscipline = this.context.character.psychics.get(discipline.id);
                return (
                    <Panel
                        className="Discipline Avatar"
                        eventKey={eventKey}
                        key={discipline.id}
                        header={
                            <PsychicDisciplineHeader
                                discipline={discipline}
                                level={characterDiscipline.level}
                                freePicks={characterDiscipline.freePicks}
                                active={this.state.activeEventKey === eventKey}
                            />
                        }
                    >
                        {
                            <PsychicDisciplineBody
                                discipline={discipline}
                                level={characterDiscipline.level}
                                knownSkillIds={characterDiscipline.knownTechniques}
                                freePicks={characterDiscipline.freePicks}
                            />
                        }
                    </Panel>
                );
            }
            else
                return (
                    <Panel
                        className="Discipline Avatar"
                        key={discipline.id}
                        eventKey={eventKey}
                        header={
                            <PsychicDisciplineHeader
                                discipline={discipline}
                                level={-1}
                                active={this.state.activeEventKey === eventKey}
                            />
                        }
                    >
                        {
                            <PsychicDisciplineBody
                                discipline={discipline}
                                level={-1}
                            />
                        }
                    </Panel>
                );
        }

        return (
            <PanelGroup accordion bordered
                defaultActiveKey={this.state.activeEventKey}
                onSelect={activeEventKey => {
                    this.setState({activeEventKey});
                }}
            >
                {[...gameObjectContext.psychicDisciplines.values()].map(
                    (value: PsychicDiscipline, i: number) => makeAvatar(value, i+1)
                )}
            </PanelGroup>
        );
    }

    render() {
        return (
        <GameObjectContext.Consumer>
        { gameObjects =>
            <div className="Psychic Panel">
                <PanelHeader
                    onReset={this.context.operations.psychics.resetPsychics}
                    onHelp={() => { /* TODO: help modal */ }}
                />
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
                    { this.makeDisciplineAvatars(gameObjects) }
                </div>
            </div>
        }
        </GameObjectContext.Consumer>
        );
    }
}