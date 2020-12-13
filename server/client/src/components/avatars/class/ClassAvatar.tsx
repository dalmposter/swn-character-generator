import React, { useContext } from "react";
import { ClassDescription, PlayerClass } from "../../../types/Object.types";
import { findObjectInMap, findObjectsInMap } from "../../../utility/GameObjectHelpers";
import { GameObjectContext } from "../../../pages/scg/Scg.types";
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

    // Don't look for the dummy id in the database
    if(props.classId === -1) return (
        <div style={props.style} className="Class Avatar padding-8">

        </div>
    );

    const playerClass = findObjectInMap(
            props.classId,
            gameObjects.classes.nonsystem
        ) as PlayerClass;
    const [fullClass, partialClass] = findObjectsInMap(
            [playerClass.full_class_id, playerClass.partial_class_id],
            gameObjects.classDescriptions
        ) as ClassDescription[];

    return (
        <label>
            <div style={props.style} className="Class Avatar padding-8">
                <input type="checkbox" style={{float: "right"}} />
                <h2 style={{marginTop: "0"}}>{playerClass.name}</h2>
                <p>{fullClass.description}</p>
                <h4 className="description-list">
                    { fullClass.ability_descriptions
                        ? fullClass.ability_descriptions.map(
                            (value: string, index: number) =>
                                <ul key={`full-${index}`}>{value}</ul>)
                        : "-" }
                </h4>
                <h3>{`Partial ${playerClass.name}`}</h3>
                <p>{partialClass.description}</p>
                <h4 className="no-bottom-margin no-margin description-list">
                    { partialClass.ability_descriptions
                        ? partialClass.ability_descriptions.map(
                            (value: string, index: number) =>
                                <ul key={`partial-${index}`}>{value}</ul>)
                        : "-" }
                </h4>
            </div>
        </label>
    );
}
