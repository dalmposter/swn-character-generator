import React, { Component } from "react";
import { FociPanelProps, FociPanelState } from "./fociPanel.types";
import "../panels.scss";
import "./foci.scss";
import { CharacterContext, GameObjectContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { Focus } from "../../../../types/Object.types";
import { FocusAvatar } from "../../../../components/avatars/foci/FocusAvatar";

const avatarStyle = {margin: "8px", marginLeft: "4px", marginRight: "4px"};

/*
    Panel for choosing character foci
    Render a list of available foci, together with chosen foci
*/
export default class FociPanel extends Component<FociPanelProps, FociPanelState>
{
    render() {
        return (
        <GameObjectContext.Consumer>
        { gameObjects =>
            <CharacterContext.Consumer>
            { characterContext =>
            <div className="Focus Panel">
                <PanelHeader {...this.props} />
                <h1>Foci</h1>
                <h2>Available Points:</h2>
                <div className="flexbox" style={{width: "80%", margin: "auto"}}>
                    <div className="flex grow">
                        <h3>{`Any: ${characterContext.foci.availablePoints.any
                                ? characterContext.foci.availablePoints.any
                                : 0}`}
                        </h3>
                    </div>
                    <div className="flex grow">
                        <h3>{`Combat: ${characterContext.foci.availablePoints.combat
                                ? characterContext.foci.availablePoints.combat
                                : 0}`}</h3>
                    </div>
                    <div className="flex grow">
                        <h3>{`Non-Combat: ${characterContext.foci.availablePoints.noncombat
                                ? characterContext.foci.availablePoints.noncombat
                                : 0}`}</h3>
                    </div>
                </div>
                <h2>Chosen Foci:</h2>
                    <div className="foci chosen flexbox">
                    { [Array.from(characterContext.foci.chosenFoci.keys())
                            .slice(characterContext.foci.chosenFoci.size/2),
                        Array.from(characterContext.foci.chosenFoci.keys())
                            .slice(0, characterContext.foci.chosenFoci.size/2)]
                        .map((list: number[], index: number) => 
                            <div className="flex grow" key={`column-${index}`}>
                            { list.map((value: number) =>
                                <FocusAvatar
                                    canPlus={this.props.canPlus}
                                    key={value}
                                    addFocus={this.props.addFocus.bind(this, value)}
                                    removeFocus={this.props.removeFocus.bind(this, value)}
                                    style={avatarStyle}
                                    focusId={value}
                                    currentLevel={characterContext.foci.chosenFoci.get(value)} />)
                            }
                            </div>
                        )
                    }
                    </div>
                <h2>Available Foci:</h2>
                    <div className="foci available flexbox">
                    {   [Array.from(gameObjects.foci)
                            .filter((focus: Focus) =>
                                !Array.from(characterContext.foci.chosenFoci.keys()).includes(focus.id))
                            .slice((gameObjects.foci.length - characterContext.foci.chosenFoci.size)/2),
                            Array.from(gameObjects.foci)
                            .filter((focus: Focus) =>
                                !Array.from(characterContext.foci.chosenFoci.keys()).includes(focus.id))
                            .slice(0, (gameObjects.foci.length - characterContext.foci.chosenFoci.size)/2)]
                        .map((list: Focus[], index: number) => 
                            <div className="flex grow" key={`available-${index}`}>
                            { list.map((focus: Focus) =>
                                <FocusAvatar
                                    canPlus={this.props.canPlus}
                                    key={focus.id}
                                    addFocus={this.props.addFocus.bind(this, focus.id)}
                                    removeFocus={this.props.removeFocus.bind(this, focus.id)}
                                    style={avatarStyle}
                                    focusId={focus.id} />)
                            }
                            </div>
                        )
                    }
                    </div>
                { false && 
                    <>
                    <h2>Origin Foci:</h2>
                        <div className="list origin">
                    </div>]
                    </>
                }
            </div>
            }
            </CharacterContext.Consumer>
        }
        </GameObjectContext.Consumer>
        );
    }
}