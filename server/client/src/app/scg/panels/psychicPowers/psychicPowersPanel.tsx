import React, { Component } from "react";
import { PsychicPowersPanelProps, PsychicPowersPanelState } from "./psychicPowers.types"
import "./psychicPowers.scss";
import { CharacterContext, GameObjectContext } from "../../Scg.types";
import { PsychicDisciplineBody, PsychicDisciplineHeader } from "../../../components/avatars/psychics/psychicDisciplineAvatar";
import { PsychicDiscipline } from "../../../../types/object.types";
import { Icon, Nav, Panel, Sidenav } from "rsuite";
import PanelFrame from "../panel/PanelFrame";
import { psychicRulesExcerptLong, psychicRulesExcerptShort } from "./PsychicDescriptions";
import { IconNames } from "rsuite/lib/Icon";


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

        this.state={
            activeDiscipline: this.props.defaultDiscipline
        };
    }

    makeAvatar = (discipline: PsychicDiscipline) =>
    {
        if(this.context.character.psychics.has(discipline.id))
        {
            let characterDiscipline = this.context.character.psychics.get(discipline.id);
            return (
                <Panel
                    className="Discipline Avatar"
                    key={discipline.id}
                    header={
                        <PsychicDisciplineHeader
                            discipline={discipline}
                            level={characterDiscipline.level}
                            freePicks={characterDiscipline.freePicks}
                            active={true}
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
                    header={
                        <PsychicDisciplineHeader
                            discipline={discipline}
                            level={-1}
                            active={true}
                        />
                    }
                >
                    <PsychicDisciplineBody
                        discipline={discipline}
                        level={-1}
                    />
                </Panel>
            );
    }

    render() {
        return (
        <GameObjectContext.Consumer>
        { gameObjects =>
            <PanelFrame
                descriptionLong={psychicRulesExcerptLong}
                descriptionShort={psychicRulesExcerptShort}
                title="Psychic Powers"
                className="Psychic"
            > {/* maxWidth could go on below div*/}
                <div className="flexbox column">
                    <div className="flexbox">
                        <Sidenav
                            style={{height: "580px",
                                borderRightWidth: "2px",
                                borderRightStyle: "ridge",
                                borderColor: "black",
                            }}
                            activeKey={this.state.activeDiscipline? this.state.activeDiscipline.id : -1}
                            className="flex"
                            onSelect={(eventKey, event) => this.setState({
                                activeDiscipline: gameObjects.psychicDisciplines.get(eventKey)
                            })}
                        >
                            <Sidenav.Header>
                                <div>
                                    <h4 style={{margin: "14px 18px 6px 18px"}}>
                                        {`Disciplines`}
                                    </h4>
                                </div>
                            </Sidenav.Header>
                            <Sidenav.Body>
                                <Nav>
                                    { [...gameObjects.psychicDisciplines.values()].map(
                                        (value: PsychicDiscipline) =>
                                            <Nav.Item eventKey={value.id} key={value.id}
                                                icon={<Icon icon={value.icon_name? value.icon_name as IconNames : "star"} />}
                                            >
                                                { value.name }
                                            </Nav.Item>
                                    )}
                                </Nav>
                            </Sidenav.Body>
                            <Sidenav.Header>
                                <div style={{marginLeft: "18px", marginRight: "16px"}}>
                                    <h4>{`Free picks: ${this.context.character.skills.availableBonuses.psychic}`}</h4>
                                    <h4>{`Any picks: ${this.context.character.skills.availableBonuses.any}`}</h4>
                                </div>
                            </Sidenav.Header>
                        </Sidenav>
                        { this.makeAvatar(this.state.activeDiscipline) }
                    </div>
                </div>
            </PanelFrame>
        }
        </GameObjectContext.Consumer>
        );
    }
}