import React, { Component } from "react";
import { BackgroundsPanelProps, BackgroundsPanelState } from "./BackgroundsPanel.types";
import "../panels.scss";
import "./backgrounds.scss";
import { Background } from "../../../../types/Object.types";
import { CharacterContext, GameObjectContext } from "../../Scg.types";
import { BackgroundAvatar } from "../../../../components/avatars/backgrounds/BackgroundAvatar";
import AttributesBonuses from "../attributes/components/AttributesBonuses";
import PanelHeader from "../components/PanelHeader";


/*
    Panel for choosing character background
    Renders a list of small background avatars next to a large avatar of the selected background
    Also an attribute bonuses section for applying earned bonuses
*/
export default class BackgroundsPanel extends Component<BackgroundsPanelProps, BackgroundsPanelState>
{
    static contextType = GameObjectContext;
    context: React.ContextType<typeof GameObjectContext>;

    constructor(props: BackgroundsPanelProps)
    {
        super(props);
        this.state = {
            selectedAvatar: React.createRef()
        }
    }

    onSelectedAvatar = (ref: any) => {
        this.setState({selectedAvatar: {...this.state.selectedAvatar, current: ref}});
    }

    makeAvailableBackgrounds()
    {
        let out = [];
        this.context.backgrounds.forEach((background: Background, index: number) =>
            out.push(
                <BackgroundAvatar
                    key={background.id}
                    id={background.id}
                    size="small"
                    onAdd={ () => this.props.setBackground(background.id) }
                />
            )
        );

        return out;
    }

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
                                    marginLeft: "4px"
                                }}
                            >
                                Available Backgrounds:
                            </h2>
                            <div className="list" style={{
                                    maxHeight: this.state.selectedAvatar.current
                                    ? this.state.selectedAvatar.current.clientHeight
                                    : "300px"
                                }}
                            >
                            { this.makeAvailableBackgrounds() }
                            </div>
                            <div style={{position: "absolute", right: 0, bottom: "-32px"}}>
                                <button onClick={() => {
                                    this.props.setBackground(
                                        gameObjects.backgrounds[
                                            Math.floor(Math.random() * gameObjects.backgrounds.size)
                                        ].id
                                    )}}
                                >
                                    Random Background
                                </button>
                            </div>
                        </div>
                    </div>
                    <AttributesBonuses currentBonuses={character.attributes.bonuses} />
                </div>
                }
                </GameObjectContext.Consumer>
        }
        </CharacterContext.Consumer>
        );
    }
}