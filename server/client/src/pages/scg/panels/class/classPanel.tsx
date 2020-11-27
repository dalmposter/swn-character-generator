import React, { Component } from "react";
import { ClassPanelProps, ClassPanelState } from "./classPanel.types";
import "../panels.scss";
import "./class.scss";
import { CharacterContext, GameObjectContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { PlayerClass } from "../../../../types/Object.types";
import { ClassAvatar } from "../../avatars/class/ClassAvatar";


/*
    Panel for choosing character skills
    Render a list of available points to spend
    And a table of available skills with inputs
*/
export class ClassPanel extends Component<ClassPanelProps, ClassPanelState>
{
    render() {
        return (
        <GameObjectContext.Consumer>
        { gameObjects => 
            <div className="Class Panel">
                <PanelHeader {...this.props} />
                <h1>Player Class</h1>
                <div className="flexbox">
                    <div className="flex grow flexbox column">
                    { gameObjects.classes.slice(0, gameObjects.classes.length/2)
                        .map((playerClass: PlayerClass) =>
                        <div className="flex grow margin-8" style={{minHeight: `${100/Math.ceil(gameObjects.classes.length / 2)}%`}}>
                            <ClassAvatar
                                key={playerClass.id}
                                classId={playerClass.id} />
                        </div>
                    )}
                    { gameObjects.classes.length % 2 == 1 &&
                        <div className="flex grow margin-8" style={{minHeight: `${100/Math.ceil(gameObjects.classes.length / 2)}%`}}>
                            <ClassAvatar
                                key={-1}
                                classId={-1} />
                        </div>
                    }
                    </div>
                    <div className="flex grow flexbox column">
                    { gameObjects.classes.slice(gameObjects.classes.length/2)
                        .map((playerClass: PlayerClass) =>
                        <div className="flex grow margin-8" style={{minHeight: `${100/Math.ceil(gameObjects.classes.length / 2)}%`}}>
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
        }
        </GameObjectContext.Consumer>
        );
    }
}