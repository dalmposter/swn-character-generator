import React, { Component } from "react";
import { BackgroundsPanelProps, BackgroundsPanelState } from "./BackgroundsPanel.types"
import "./backgrounds.scss";
import { Background } from "../../../../types/Object.types";
import { CharacterContext, GameObjectContext } from "../../Scg.types";
import { BackgroundAvatar } from "../../../components/avatars/backgrounds/BackgroundAvatar";
import { Button, Modal } from "rsuite";
import PanelFrame from "../panel/PanelFrame";
import { backgroundsRulesExcerptLong, backgroundsRulesExcerptShort } from "./BackgroundsDescriptions";


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
            selectedAvatar: React.createRef(),
            growthCount: 0,
            shownDesc: false,
            listHeight: 300,
        }
    }

    componentDidUpdate(prevProps)
    {
        if(this.state.selectedAvatar.current &&
            this.state.selectedAvatar.current.clientHeight !== this.state.listHeight)
            this.setState({listHeight: this.state.selectedAvatar.current.clientHeight});
    }

    getAvailableBackgrounds(exclude: number[] = [])
    {
        let out: Background[] = [];
        this.context.backgrounds.forEach((background: Background, index: number) => {
            if(!exclude.includes(background.id)) out.push(background)}
        );
        return out;
    }

    render() {
        return (
        <PanelFrame
            descriptionLong={backgroundsRulesExcerptLong}
            descriptionShort={backgroundsRulesExcerptShort}
            title="Backgrounds"
            className="Backgrounds"
        >
            <CharacterContext.Consumer>
            { characterContext =>
                <div className="flexbox">
                    <div className="flex grow bg available">
                        { /* Right panel. Shows list of small avatars of all available bgs */ }
                        <div className="list"
                            style={{maxHeight: `${this.state.listHeight - 37}px`}}
                        >
                        {   // Actually make the list, exclude selected bg
                            this.getAvailableBackgrounds([characterContext.character.background.id])
                                .map(background =>
                                <BackgroundAvatar
                                    key={background.id}
                                    id={background.id}
                                    size="small"
                                    onAdd={ characterContext.character.background.confirmed
                                        ? null
                                        : () => characterContext.operations.backgrounds.setBackground(background.id)
                                    }
                                    onInspect={() => this.setState({ inspectedBg: background })}
                                />)
                        }
                        </div>
                        <Button onClick={() => {
                            characterContext.operations.backgrounds.setBackground(
                                this.context.backgrounds.get(
                                    Math.floor(Math.random() * (this.context.backgrounds.size - 1))
                                ).id
                            )}}
                            disabled={ characterContext.character.background.confirmed }
                        >
                            Random Background
                        </Button>
                    </div>
                    <div className="flex grow bg interactive">
                        { /* Left panel. Shows large avatar of selected bg */ }
                        <BackgroundAvatar
                            key={characterContext.character.background.id}
                            id={characterContext.character.background.id}
                            size="large"
                            descriptionMaxHeight="92px"
                            setHeight={ (listHeight) => this.setState({listHeight}) }
                            currentHeight={ this.state.listHeight }
                            tableRolls={ this.props.tableRolls}
                            setShownDesc={ (shownDesc: boolean) => this.setState({ shownDesc })}
                            shownDesc={ this.state.shownDesc }
                            confirmed={characterContext.character.background.confirmed}
                            setConfirmed={(quickSkillIds: number[] = [], freeSkillId = -1) =>
                                characterContext.operations.backgrounds.setConfirmed(true, quickSkillIds, freeSkillId)
                            }
                            isQuick={characterContext.character.background.quick}
                            setQuick={characterContext.operations.backgrounds.setQuick}
                            rolledSkillIds={characterContext.character.background.rolledSkillIds}
                            setRolledSkillIds={characterContext.operations.backgrounds.setRolledSkillIds}
                        />
                    </div>
                </div>
            }
            </CharacterContext.Consumer>
            <Modal show={this.state.inspectedBg !== undefined}
                onHide={() => this.setState({ inspectedBg: undefined })}
            >
                <Modal.Header>
                    <Modal.Title>
                        { this.state.inspectedBg? this.state.inspectedBg.name : "error" }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.inspectedBg? this.state.inspectedBg.description : "error"}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.setState({ inspectedBg: undefined })}
                        appearance="primary"
                    >
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </PanelFrame>
        );
    }
}