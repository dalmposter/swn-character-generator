import React, { Component } from "react";
import { GeneralPanelProps, GeneralPanelState } from "./GeneralPanel.types"
import "./generalPanel.scss";
import { CharacterContext } from "../../Scg.types";

/**
 * Render panel showing general stats of the character
 * Include level, hp, attack bonus, ac
 */
export default class GeneralPanel extends Component<GeneralPanelProps, GeneralPanelState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    render() {
        return (
            <div className="General Panel">
                <div className="flexbox">
                    <h3 className="flex grow">
                        {`Level: ${this.context.character.level}`}
                    </h3>
                    <h3 className="flex grow">
                        {`Hit points: ${this.context.character.finalHp}`}
                    </h3>
                    <h3 className="flex grow">
                        {`Attack bonus: ${this.context.character.attackBonus}`}
                    </h3>
                    <h3 className="flex grow" style={{textAlign: "right"}}>
                        {`Armour class: ${this.context.character.ac}`}
                    </h3>
                </div>
            </div>
        );
    }
}