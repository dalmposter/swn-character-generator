import React, { Component } from "react";
import { FociPanelProps, FociPanelState } from "./fociPanel.types"
import "./foci.scss";
import { CharacterContext, GameObjectContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { Focus } from "../../../../types/object.types";
import { FocusAvatar } from "../../../components/avatars/foci/FocusAvatar";

const avatarStyle = {margin: "8px", marginLeft: "4px", marginRight: "4px"};

/*
    Panel for choosing character foci
    Render a list of available foci, and another of chosen foci
*/
export default class FociPanel extends Component<FociPanelProps, FociPanelState>
{
    static contextType = GameObjectContext;
    context: React.ContextType<typeof GameObjectContext>;

    makeAvailableFoci(takenFoci: number[],
        addFocus: (focusId: number) => void,removeFocus: (focusId) => void,
        canPlus: "any" | "combat" | "noncombat")
    {
        let out = [];

        this.context.foci.forEach((focus: Focus, index: number) => {
            if(!takenFoci.includes(focus.id)) out.push(
                <FocusAvatar
                    canPlus={canPlus}
                    key={focus.id}
                    addFocus={addFocus.bind(this, focus.id)}
                    removeFocus={removeFocus.bind(this, focus.id)}
                    style={avatarStyle}
                    focusId={focus.id} />)
        });

        return (
            <>
            <div className="flex grow">
                {out.slice(0, out.length / 2)}
            </div>
            <div className="flex grow">
                {out.slice(out.length / 2)}
            </div>
            </>
        );
    }

    render() {
        return (
        <CharacterContext.Consumer>
        { characterContext =>
        <div className="Focus Panel">
            <PanelHeader
                onReset={characterContext.operations.foci.resetFoci}
                onHelp={() => { /* TODO: help modal */ }}
            />
            <h1>Foci</h1>
            <h2>Available Points:</h2>
            <div className="flexbox" style={{width: "80%", margin: "auto"}}>
                <div className="flex grow">
                    <h3>{`Any: ${characterContext.character.foci.availablePoints.any
                            ? characterContext.character.foci.availablePoints.any
                            : 0}`}
                    </h3>
                </div>
                <div className="flex grow">
                    <h3>{`Combat: ${characterContext.character.foci.availablePoints.combat
                            ? characterContext.character.foci.availablePoints.combat
                            : 0}`}</h3>
                </div>
                <div className="flex grow">
                    <h3>{`Non-Combat: ${characterContext.character.foci.availablePoints.noncombat
                            ? characterContext.character.foci.availablePoints.noncombat
                            : 0}`}</h3>
                </div>
            </div>
            <h2>Chosen Foci:</h2>
                <div className="foci chosen flexbox">
                { [Array.from(characterContext.character.foci.chosenFoci.keys())
                        .slice(characterContext.character.foci.chosenFoci.size/2),
                    Array.from(characterContext.character.foci.chosenFoci.keys())
                        .slice(0, characterContext.character.foci.chosenFoci.size/2)]
                    .map((list: number[], index: number) => 
                        <div className="flex grow" key={`column-${index}`}>
                        { list.map((value: number) =>
                            <FocusAvatar
                                canPlus={characterContext.character.foci.canPlus}
                                key={value}
                                addFocus={() => characterContext.operations.foci.addFocus(value)}
                                removeFocus={() => characterContext.operations.foci.removeFocus(value)}
                                style={avatarStyle}
                                focusId={value}
                                currentLevel={characterContext.character.foci.chosenFoci.get(value)} />)
                        }
                        </div>
                    )
                }
                </div>
            <h2>Available Foci:</h2>
                <div className="foci available flexbox">
                { this.makeAvailableFoci(
                    [...characterContext.character.foci.chosenFoci.keys()],
                    characterContext.operations.foci.addFocus,
                    characterContext.operations.foci.removeFocus,
                    characterContext.character.foci.canPlus)
                }
                </div>
            {   // Later, origin foci may be implemented
                false && 
                    <>
                    <h2>Origin Foci:</h2>
                        <div className="list origin">
                    </div>]
                    </>
            }
        </div>
        }
        </CharacterContext.Consumer>
        );
    }
}