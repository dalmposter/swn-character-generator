import React, { Component } from "react";
import { PsychicPowersPanelProps, PsychicPowersPanelState } from "./psychicPowers.types";
import "../panels.scss";
import "./psychicPowers.scss";
import { CharacterContext, GameObjectContext } from "../../Scg.types";
import AttributesBonuses from "../attributes/components/AttributesBonuses";
import PanelHeader from "../components/PanelHeader";


/*
    Panel for choosing character background
    Renders a list of small background avatars next to a large avatar of the selected background
    Also an attribute bonuses section for applying earned bonuses
*/
export default class PsychiPowersPanel extends Component<PsychicPowersPanelProps, PsychicPowersPanelState>
{

    render() {
        return (
        <CharacterContext.Consumer>
        { character =>
            <GameObjectContext.Consumer>
            { gameObjects => 
                <div className="Backgrounds Panel">
                    <PanelHeader {...this.props} />
                    <div className="flexbox">
                        <div className="flex grow bg interactive">
                            { /* Left panel - discipline 1 */ }
                        </div>
                        <div className="flex grow bg available">
                            { /* Right panel - discipline 2 */ }
                        </div>
                    </div>
                    <AttributesBonuses currentBonuses={character.attributes.bonuses} />
                </div>
            }
            </GameObjectContext.Consumer>
        }
        </CharacterContext.Consumer>
        );
    }
}