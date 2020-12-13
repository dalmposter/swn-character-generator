import React, { Component } from "react";
import { ClassPanelProps, ClassPanelState } from "./classPanel.types";
import "../panels.scss";
import "./class.scss";
import { GameObjectContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { ClassAvatar } from "../../../../components/avatars/class/ClassAvatar";
import { findObjectInMap } from "../../../../utility/GameObjectHelpers";


/*
    Panel for choosing character class
    Render an avatar for each playable class
    Players can select up to n classes, where n is given in the ruleset
*/
export default class ClassPanel extends Component<ClassPanelProps, ClassPanelState>
{
    static contextType = GameObjectContext;
    context: React.ContextType<typeof GameObjectContext>;

    makeClassList()
    {
        let out: React.ReactElement[] = [];
        const keys = [...this.context.classes.nonsystem.keys()];
        // Generate rows of 2 classes each
        for(let i = 0; i < keys.length; i+=2)
        {
            out.push(
            <div className="flexbox" key={i}>
                <div className="flex grow padding-8"
                    key={`classAvatar-${i}`}
                >
                    <ClassAvatar
                        key={findObjectInMap(keys[i], this.context.classes.nonsystem).id}
                        classId={findObjectInMap(keys[i], this.context.classes.nonsystem).id} />
                </div>
                {   // If there is an odd number of classes available, generate a placeholder
                    i+1 < keys.length
                    ? <div className="flex grow padding-8"
                        key={`classAvatar-${i+1}`}
                        >
                            <ClassAvatar
                                key={findObjectInMap(keys[i+1], this.context.classes.nonsystem).id}
                                classId={findObjectInMap(keys[i+1], this.context.classes.nonsystem).id} />
                        </div>
                    : <div className="flex grow padding-8" />
                }
            </div>
            );
        }
        
        return out;
    }

    render() {
       return (
        <div className="Class Panel">
            <PanelHeader {...this.props} />
            <h1>Player Class</h1>
            <div className="flexbox column">
                { this.makeClassList() }
                { this.context.classes.nonsystem.size % 2 === 1 &&
                    <div className="flex grow padding-8">
                    </div>
                }
            </div>
            <div style={{textAlign: "center"}}>
                <button style={{width: "70%"}}>Choose Class</button>
            </div>
        </div>
        );
    }
}