import React from "react";
import { Button, Checkbox, Modal, Panel } from "rsuite";
import { CharacterContext } from "../../../scg/Scg.types";
import "./classAvatar.scss";
import { ClassAvatarProps, ClassAvatarState } from "./ClassAvatar.types";

export class ClassAvatarHeader extends React.Component<ClassAvatarProps, ClassAvatarState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    render()
    {
        let selected = this.context.character.class.classIds.has(this.props.playerClass.id);
        return (
            <div style={this.props.style}
                className={
                    "class-header " +
                    (selected? "selected" : "unselected")
                }
            >
                <Checkbox
                    style={{position: "absolute", right: "32px", top: "6px", zIndex: 1000}}
                    checked={ this.context.character.class.classIds.has(this.props.playerClass.id) }
                    onClick={(event) => {
                        event.stopPropagation();
                        if(!selected)
                        {
                            console.log("adding class");
                            this.context.operations.classes.addClassId(this.props.playerClass.id);
                        }
                        else
                        {
                            console.log("Removing class");
                            this.context.operations.classes.removeClassId(this.props.playerClass.id);
                        }
                    }}
                    disabled={this.context.character.class.confirmed}
                />
                <Button
                    style={{position: "absolute", right: "56px", top: "6px", zIndex: 1000,
                        height: "18px", width: "16px"}}
                    size="xs"
                    className="info-button"
                    onClick={() => this.context.operations.meta.setActiveModal({
                        header: <Modal.Header>
                                    <Modal.Title style={{textAlign: "center"}}>
                                        { this.props.playerClass.name }
                                    </Modal.Title>
                                </Modal.Header>,
                        body:	<Modal.Body style={{paddingBottom: "16px", textAlign: "justify"}} className="flexbox">
                                    { this.props.playerClass.full_class.description }
                                </Modal.Body>,
                        backdrop: false,
                    })}
                >
                    <p style={{marginTop: "-2px",
                        marginLeft: "-1px", fontSize: 10}}
                    >
                        i
                    </p>
                </Button>
                <h2 style={{marginLeft: "12px"}}>{this.props.playerClass.name}</h2>
            </div>
        );
    }
}

export class ClassAvatarBody extends React.Component<ClassAvatarProps, ClassAvatarState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    render()
    {
        return (
            <div style={this.props.style}
                className={
                    "class-body " +
                    (this.props.selected
                        ? "selected"
                        : "unselected")
                }
            >
                <ul className="description-list">
                { this.props.playerClass.full_class.ability_descriptions
                    ? this.props.playerClass.full_class.ability_descriptions.map(
                        (value: string, index: number) =>
                            <li key={`full-${index}`}>{value}</li>)
                    : "-" }
                </ul>
                <h2 className="partial-class" style={{marginLeft: "12px"}}>
                    {`Partial ${this.props.playerClass.name}`}
                </h2>
                <ul className="no-margin description-list">
                { this.props.playerClass.partial_class.ability_descriptions
                    ? this.props.playerClass.partial_class.ability_descriptions.map(
                        (value: string, index: number) =>
                            <li key={`partial-${index}`}>{value}</li>)
                    : "-" }
                </ul>
            </div>
        );
    }
}

/**
 * Display an informative selector for a class. Includes full and partial class details
 * Takes ID and fetches the class to render
 */
export default class ClassAvatar extends React.Component<ClassAvatarProps, ClassAvatarState>
{
    render()
    {
        return(
            <Panel
                className="Class Avatar"
                header={
                    <ClassAvatarHeader playerClass={this.props.playerClass}/>
                }
            >
                <ClassAvatarBody playerClass={this.props.playerClass} />
            </Panel>
        );
    }
}