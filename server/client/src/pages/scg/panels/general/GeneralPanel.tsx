import React, { Component } from "react";
import { GeneralPanelProps, GeneralPanelState } from "./GeneralPanel.types";
import "../panels.scss";
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
                <h1 style={{textAlign: "center", margin: "4px"}}>
                    {this.context.character.name === ""
                        ? "New Character"
                        : this.context.character.name
                    }
                </h1>
                <div className="flexbox">
                    <h2 className="flex grow">
                        {`Level: ${this.context.character.level}`}
                    </h2>
                    <h2 className="flex grow">
                        {`Hit points: ${this.context.character.finalHp}`}
                    </h2>
                    <h2 className="flex grow">
                        {`Attack bonus: ${this.context.character.attackBonus}`}
                    </h2>
                    <h2 className="flex grow" style={{textAlign: "right"}}>
                        {`Armour class: ${this.context.character.ac}`}
                    </h2>
                </div>
            </div>
        );
    }
}