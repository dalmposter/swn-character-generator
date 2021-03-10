import React, { useContext } from "react";
import {  PlayerClass } from "../../../types/Object.types";
import { findObjectInMap } from "../../../utility/GameObjectHelpers";
import { CharacterContext, GameObjectContext } from "../../../pages/scg/Scg.types";
import "./classAvatar.scss";

interface ClassAvatarProps
{
    classId: number;
    style?: React.CSSProperties;
}

/**
 * Display an informative selector for a class. Includes full and partial class details
 * Takes ID and fetches the class to render
 */
export function ClassAvatar(props: ClassAvatarProps)
{
    const gameObjects = useContext(GameObjectContext);
    const characterContext = useContext(CharacterContext);

    // Don't look for the dummy id in the database
    if(props.classId === -1) return (
        <div style={props.style} className="Class Avatar padding-8">

        </div>
    );

    const playerClass: PlayerClass = findObjectInMap(
            props.classId,
            gameObjects.classes.nonsystem
        );

    return (
        <label>
            <div style={props.style}
                className={
                    "Class Avatar padding-8 " +
                    (characterContext.character.class.classIds.has(props.classId)
                        ? "selected"
                        : "unselected")
                }
            >
                <input type="checkbox" style={{float: "right"}}
                    checked={ characterContext.character.class.classIds.has(props.classId) }
                    onChange={(event) => {
                        if(event.target.checked) characterContext.operations.classes.addClassId(props.classId)
                        else characterContext.operations.classes.removeClassId(props.classId);
                    }}
                    disabled={characterContext.character.class.confirmed}
                />
                <h2 style={{marginTop: "0"}}>{playerClass.name}</h2>
                <p>{playerClass.full_class.description}</p>
                <h4 className="description-list">
                    { playerClass.full_class.ability_descriptions
                        ? playerClass.full_class.ability_descriptions.map(
                            (value: string, index: number) =>
                                <ul key={`full-${index}`}>{value}</ul>)
                        : "-" }
                </h4>
                <h3>{`Partial ${playerClass.name}`}</h3>
                <p>{playerClass.partial_class.description}</p>
                <h4 className="no-bottom-margin no-margin description-list">
                    { playerClass.partial_class.ability_descriptions
                        ? playerClass.partial_class.ability_descriptions.map(
                            (value: string, index: number) =>
                                <ul key={`partial-${index}`}>{value}</ul>)
                        : "-" }
                </h4>
            </div>
        </label>
    );
}
