import React, { Component } from "react";
import { BackgroundsPanelProps, BackgroundsPanelState } from "./BackgroundsPanel.types";
import "../panels.scss";
import "./backgrounds.scss";
import { Background } from "../../../../types/Object.types";
import { GameObjectContext } from "../../Scg.types";
import { BackgroundAvatar } from "../../avatars/backgrounds/BackgroundAvatar";

export class BackgroundsPanel extends Component<BackgroundsPanelProps, BackgroundsPanelState>
{
    static contextType = GameObjectContext;

    constructor(props: BackgroundsPanelProps)
    {
        super(props);
    }

    render() {
        return (
            <div className="Backgrounds">
                <h1>Backgrounds</h1>
                <div>
                    { this.context.backgrounds &&
                        this.context.backgrounds.map((background: Background) =>
                        <BackgroundAvatar key={background.id} id={background.id} size="small" /> ) }
                </div>
            </div>
        );
    }
}