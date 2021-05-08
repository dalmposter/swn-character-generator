import React, { Component } from "react";
import { ClassPanelProps, ClassPanelState } from "./classPanel.types"
import { CharacterContext, GameObjectContext, GameObjectsContext } from "../../Scg.types";
import { classRulesExcerptLong, classRulesExcerptShort } from "./ClassDescriptions";
import PanelFrame from "../panel/PanelFrame";
import { Button, Panel, PanelGroup } from "rsuite";
import { ClassAvatarHeader, ClassAvatarBody } from "../../../components/avatars/class/ClassAvatar";
import { PlayerClass } from "../../../../types/Object.types";
import "./class.scss";


/*
    Panel for choosing character class
    Render an avatar for each playable class
    Players can select up to n classes, where n is given in the ruleset
*/
export default class ClassPanel extends Component<ClassPanelProps, ClassPanelState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    constructor(props)
    {
        super(props);

        this.state = {
            activeEventKey: 0,
        };
    }

    makeClassList(objects: GameObjectsContext)
    {
        let makeAvatar = (playerClass: PlayerClass, eventKey: number) =>
            <Panel bordered
                className={`Class Avatar${
                    this.context.character.class.classIds.has(playerClass.id)
                        ? " selected"
                        : ""
                    }`
                }
                key={playerClass.id}
                eventKey={eventKey}
                header={
                    <ClassAvatarHeader playerClass={playerClass}/>
                }
                selected={this.context.character.class.classIds.has(playerClass.id)}
            >
                <ClassAvatarBody playerClass={playerClass} />
            </Panel>
        
        return (
            <PanelGroup accordion bordered
                defaultActiveKey={this.state.activeEventKey}
                style={{backgroundColor: "navajowhite", borderColor: "grey"}}
                onSelect={activeEventKey => {
                    this.setState({activeEventKey});    
                }}
            >
                {[...objects.classes.nonsystem.values()].map(
                    (value: PlayerClass, i: number) => makeAvatar(value, i)
                )}
            </PanelGroup>
        );
    }

    render() {
       return (
        <PanelFrame
            descriptionShort={classRulesExcerptShort}
            descriptionLong={classRulesExcerptLong}
            title="Character Class"
            className="Class"
        >
            <GameObjectContext.Consumer>
            { objectsContext =>
                <div className="flexbox column" style={{position: "relative"}}>
                    { this.makeClassList(objectsContext) }
                    <Button style={{position: "absolute", right: "-204px", bottom: 0}}
                        appearance="primary" className="no-margins"
                        onClick={() => this.context.operations.classes.confirmClass()}
                        disabled={this.context.character.class.confirmed
                            || this.context.character.class.classIds.size === 0
                        }
                    >
                        <h3>Confirm Class</h3>
                    </Button>
                </div>
            }
            </GameObjectContext.Consumer>
        </PanelFrame>
        );
    }
}