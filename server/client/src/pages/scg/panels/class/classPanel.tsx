import React, { Component } from "react";
import { ClassPanelProps, ClassPanelState } from "./classPanel.types";
import "../panels.scss";
import "./class.scss";
import { GameObjectContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { PlayerClass } from "../../../../types/Object.types";
import { ClassAvatar } from "../../../../components/avatars/class/ClassAvatar";


/*
    Panel for choosing character class
    Render an avatar for each playable class
    Players can select 1 or 2
*/
export default class ClassPanel extends Component<ClassPanelProps, ClassPanelState>
{
    static contextType = GameObjectContext;

    render() {
        const classAvatarHeight = `${100/Math.ceil(this.context.classes.length / 2)}%`;
        
        return (
        <div className="Class Panel">
            <PanelHeader {...this.props} />
            <h1>Player Class</h1>
            <div className="flexbox">
                <div className="flex grow flexbox column">
                { this.context.classes.slice(0, this.context.classes.length/2)
                    .map((playerClass: PlayerClass) =>
                    <div className="flex grow margin-8"
                        style={{minHeight: classAvatarHeight}}
                        key={`classAvatar-${playerClass.id}`}
                    >
                        <ClassAvatar
                            key={playerClass.id}
                            classId={playerClass.id} />
                    </div>
                )}
                { this.context.classes.length % 2 === 1 &&
                    <div className="flex grow margin-8"
                        style={{minHeight: classAvatarHeight}}
                    >
                    </div>
                }
                </div>
                <div className="flex grow flexbox column">
                { this.context.classes.slice(this.context.classes.length/2)
                    .map((playerClass: PlayerClass) =>
                    <div className="flex grow margin-8"
                        style={{minHeight: classAvatarHeight}}
                        key={`classAvatar-${playerClass.id}`}
                    >
                        <ClassAvatar
                            key={playerClass.id}
                            classId={playerClass.id} />
                    </div>
                )}
                </div>
            </div>
            <div style={{textAlign: "center"}}>
                <button style={{width: "70%"}}>Choose Class</button>
            </div>
        </div>
        );
    }
}