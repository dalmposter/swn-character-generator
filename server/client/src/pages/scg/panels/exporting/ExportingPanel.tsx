import React, { Component } from "react";
import { replacer } from "../../../../utility/JavascriptObjectHelpers";
import { CharacterContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { ExportingPanelState, ExportingPanelProps } from "./ExportingPanel.types";

/*
 *  Panel for saving and exporting character
 *  Currently serves as a viewport to see the character json
 */
export default class ExportingPanel extends Component<ExportingPanelProps, ExportingPanelState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    render() {
        return (
            <div className="Exporting Panel">
                <PanelHeader {...this.props} />
                <h1>Save/Export Character</h1>
                <h2>Character JSON preview:</h2>
                <textarea
                    style={{width: "100%", height: "480px"}}
                    value={ JSON.stringify(this.context.character, replacer, 2) }
                    readOnly
                />
            </div>
        );
    }3
}