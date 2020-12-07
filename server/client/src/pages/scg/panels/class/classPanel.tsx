import React, { Component } from "react";
import { ClassPanelProps, ClassPanelState } from "./classPanel.types";
import "../panels.scss";
import "./class.scss";
import { GameObjectContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { PlayerClass } from "../../../../types/Object.types";
import { ClassAvatar } from "../../../../components/avatars/class/ClassAvatar";
import { findObjectInMap } from "../../../../utility/GameObjectHelpers";


/*
    Panel for choosing character class
    Render an avatar for each playable class
    Players can select 1 or 2
*/
export default class ClassPanel extends Component<ClassPanelProps, ClassPanelState>
{
    static contextType = GameObjectContext;
    context: React.ContextType<typeof GameObjectContext>;

    makeClassList(avatarHeight: string, start: number, end: number = -1)
    {
        if(end === -1) end = this.context.classes.nonsystem.size;
        let out: React.ReactElement[] = [];
        const keys = [...this.context.classes.nonsystem.keys()];
        for(let i = Math.ceil(start); i < end; i++)
        {
            const key = keys[i];
            out.push(
                <div className="flex grow margin-8"
                    style={{minHeight: avatarHeight}}
                    key={`classAvatar-${i}`}
                >
                    <ClassAvatar
                        key={findObjectInMap(this.context.classes.nonsystem, key).id}
                        classId={findObjectInMap(this.context.classes.nonsystem, key).id} />
                </div>
            );
        }
        
        return out;
    }

    render() {
        const classAvatarHeight = `${100/Math.ceil(this.context.classes.nonsystem.size / 2)}%`;
        
        return (
        <div className="Class Panel">
            <PanelHeader {...this.props} />
            <h1>Player Class</h1>
            <div className="flexbox">
                <div className="flex grow flexbox column">
                { this.makeClassList(classAvatarHeight, 0, this.context.classes.nonsystem.size/2) }
                { this.context.classes.nonsystem.size % 2 === 1 &&
                    <div className="flex grow margin-8"
                        style={{minHeight: classAvatarHeight}}
                    >
                    </div>
                }
                </div>
                <div className="flex grow flexbox column">
                { this.makeClassList(classAvatarHeight, this.context.classes.nonsystem.size/2) }
                </div>
            </div>
            <div style={{textAlign: "center"}}>
                <button style={{width: "70%"}}>Choose Class</button>
            </div>
        </div>
        );
    }
}