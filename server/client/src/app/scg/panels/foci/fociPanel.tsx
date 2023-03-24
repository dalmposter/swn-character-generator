import React, { Component } from "react";
import { FociPanelProps, FociPanelState } from "./fociPanel.types"
import "./foci.scss";
import { CharacterContext, GameObjectContext } from "../../Scg.types";
import { Focus } from "../../../../types/Object.types";
import FocusAvatar from "../../../components/avatars/foci/FocusAvatar";
import PanelFrame from "../panel/PanelFrame";
import { fociRulesExcerptLong, fociRulesExcerptShort } from "./FociDescriptions";

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
                    size="large"
                    canPlus={canPlus}
                    key={focus.id}
                    addFocus={addFocus.bind(this, focus.id)}
                    removeFocus={removeFocus.bind(this, focus.id)}
                    focusId={focus.id} />)
        });

        return out;
    }

    render() {
        return (
        <CharacterContext.Consumer>
        { characterContext =>
            <PanelFrame
                descriptionLong={fociRulesExcerptLong}
                descriptionShort={fociRulesExcerptShort}
                title="Foci"
                className="Foci"
            >
            
                <div className="flexbox" style={{marginBottom: "6px", minWidth: "max-content"}}>
                    <div className="flex no-margins" style={{marginRight: "16px"}}>
                        <h2>{`Points:`}</h2>
                    </div>
                    <div className="flex grow no-margins">
                        <h3 style={{marginTop: "6px"}}>
                            {`Any: ${characterContext.character.foci.availablePoints.any
                                ? characterContext.character.foci.availablePoints.any
                                : 0}`}
                        </h3>
                    </div>
                    <div className="flex grow no-margins">
                        <h3 style={{marginTop: "6px"}}>
                            {`Combat: ${characterContext.character.foci.availablePoints.combat
                                ? characterContext.character.foci.availablePoints.combat
                                : 0}`}
                        </h3>
                    </div>
                    <div className="flex grow no-margins">
                        <h3 style={{marginTop: "6px"}}>
                            {`Non-Combat: ${characterContext.character.foci.availablePoints.noncombat
                                ? characterContext.character.foci.availablePoints.noncombat
                                : 0}`}
                        </h3>
                    </div>
                </div>
                <div className="flexbox">
                    <div className="flex grow">
                        <h2>Available:</h2>
                        <div className="foci available flexbox column" style={{maxHeight: "512px"}}>
                            { this.makeAvailableFoci(
                                [...characterContext.character.foci.chosenFoci.keys()],
                                characterContext.operations.foci.addFocus,
                                characterContext.operations.foci.removeFocus,
                                characterContext.character.foci.canPlus)
                            }
                        </div>
                    </div>
                    <div className="flex grow" style={{marginLeft: "6px"}}>
                        <h2>Chosen Foci:</h2>
                        <div className="foci chosen flexbox column" style={{maxHeight: "512px"}}>
                            { Array.from(characterContext.character.foci.chosenFoci.keys())
                                .map((value: number) =>
                                    <FocusAvatar
                                        size="large"
                                        canPlus={characterContext.character.foci.canPlus}
                                        key={value}
                                        addFocus={() => characterContext.operations.foci.addFocus(value)}
                                        removeFocus={() => characterContext.operations.foci.removeFocus(value)}
                                        focusId={value}
                                        currentLevel={characterContext.character.foci.chosenFoci.get(value)}
                                    />
                                )
                            }
                        </div>
                    </div>
                </div>
            </PanelFrame>
        }
        </CharacterContext.Consumer>
        );
    }
}