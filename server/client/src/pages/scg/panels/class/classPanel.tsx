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
                <div>
                    {gameObjects.classes.map((playerClass: PlayerClass) =>
                        <ClassAvatar
                            style={{margin: "8px"}}
                            key={playerClass.id}
                            classId={playerClass.id} />
                    )}
                </div>
            </div>
        }
        </GameObjectContext.Consumer>
        );
    }
}