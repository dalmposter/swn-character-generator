import React, { Component } from "react";
import { IntroPanelProps, IntroPanelState } from "./IntroPanel.types"
import "./introPanel.scss";
import { CharacterContext } from "../../Scg.types";

/**
 * Render an introductory panel explaining the tool
 */
export default class IntroPanel extends Component<IntroPanelProps, IntroPanelState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    render() {
        return (
            <div className="Intro Panel">
                <h1>Hello, World!</h1>
            </div>
        );
    }
}