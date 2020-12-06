import React, { Component } from "react";
import { PsychicPowersPanelProps, PsychicPowersPanelState } from "./psychicPowers.types";
import "../panels.scss";
import "./psychicPowers.scss";
import { CharacterContext, GameObjectContext } from "../../Scg.types";
import AttributesBonuses from "../attributes/components/AttributesBonuses";
import PanelHeader from "../components/PanelHeader";
import PsychicDisciplineAvatar from "../../../../components/avatars/psychics/psychicDisciplineAvatar";


/*
    Panel for choosing character background
    Renders a list of small background avatars next to a large avatar of the selected background
    Also an attribute bonuses section for applying earned bonuses
*/
export default class PsychicPowersPanel extends Component<PsychicPowersPanelProps, PsychicPowersPanelState>
{

    render() {
        return (
        <CharacterContext.Consumer>
        { character =>
            <GameObjectContext.Consumer>
            { gameObjects => 
                <div className="Backgrounds Panel">
                    <PanelHeader {...this.props} />
                    <h1>Psychic Powers</h1>
                    <div className="flexbox">
                        <div className="flex grow">
                            { /* Left panel - discipline 1 */ }
                            <PsychicDisciplineAvatar id={1} />
                        </div>
                        <div className="flex grow">
                            { /* Right panel - discipline 2 */ }
                            <PsychicDisciplineAvatar id={2} />
                        </div>
                    </div>
                </div>
            }
            </GameObjectContext.Consumer>
        }
        </CharacterContext.Consumer>
        );
    }
}