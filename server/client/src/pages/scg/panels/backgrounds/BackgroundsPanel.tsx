import React, { Component } from "react";
import { BackgroundsPanelProps, BackgroundsPanelState } from "./BackgroundsPanel.types";
import "../panels.scss";
import "./backgrounds.scss";
import { Background } from "../../../../types/Object.types";
import { CharacterContext, GameObjectContext } from "../../Scg.types";
import { BackgroundAvatar } from "../../avatars/backgrounds/BackgroundAvatar";
import AttributesBonuses from "../attributes/components/AttributesBonuses";
import PanelHeader from "../components/PanelHeader";


/*
    Panel for choosing character background
    Renders a list of small background avatars next to a large avatar of the selected background
    Also an attribute bonuses section for applying earned bonuses
*/
export class BackgroundsPanel extends Component<BackgroundsPanelProps, BackgroundsPanelState>
{
    selectedAvatar;

    constructor(props: BackgroundsPanelProps)
    {
        super(props);
        this.selectedAvatar = React.createRef();
    }

    componentDidMount()
    {
        const height = this.selectedAvatar.current.clientHeight;
        console.log("height", height);
    }

    onSelectedAvatar = (ref: any) => this.selectedAvatar.current = ref;

    render() {
        return (
        <CharacterContext.Consumer>
        { character =>
            <GameObjectContext.Consumer>
            { gameObjects => 
                <div className="Backgrounds Panel">
                    <PanelHeader {...this.props} />
                    <div className="flexbox">
                        <div className="flex grow bg interactive">
                            { /* Left panel. Shows large avatar of selected bg */ }
                            <div className="flex grow">
                                <h1 style={{ marginBottom: "12px" }} >
                                    Background
                                </h1>
                                <BackgroundAvatar
                                    key={character.background.value}
                                    id={character.background.value}
                                    size="large"
                                    descriptionMaxHeight="92px"
                                    onRef={ this.onSelectedAvatar }
                                    tableRolls={ this.props.tableRolls}
                                />
                            </div>
                        </div>
                        <div className="flex grow bg available">
                            { /* Right panel. Shows list of small avatars of all available bgs */ }
                            <h2 style={{
                                    marginBottom: "12px",
                                    marginTop: "31px",
                                    marginLeft: "12px"
                                }}
                            >
                                Available Backgrounds:
                            </h2>
                            <div className="list" style={{
                                    maxHeight: this.selectedAvatar.current
                                    ? this.selectedAvatar.current.clientHeight
                                    : "300px"
                                }}
                            >
                            { gameObjects.backgrounds &&
                                gameObjects.backgrounds.map((background: Background, index: number) =>
                                    <BackgroundAvatar
                                        key={background.id}
                                        id={background.id}
                                        size="small"
                                        onAdd={ () => this.props.setBackground(background.id) }
                                    />
                            ) }
                            </div>
                            <div style={{position: "absolute", right: 0, bottom: "-32px"}}>
                                <button onClick={() => {
                                    this.props.setBackground(
                                        gameObjects.backgrounds[
                                            Math.floor(Math.random() * gameObjects.backgrounds.length)
                                        ].id
                                    )}}
                                >
                                    Random Background
                                </button>
                            </div>
                        </div>
                    </div>
                    <AttributesBonuses currentBonuses={this.props.currentBonuses} />
                </div>
                }
                </GameObjectContext.Consumer>
        }
        </CharacterContext.Consumer>
        );
    }
}