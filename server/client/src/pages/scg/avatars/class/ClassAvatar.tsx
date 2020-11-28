import React, { useContext } from "react";
import { ClassDescription, PlayerClass } from "../../../../types/Object.types";
import { findById, findObjectInList, findObjectsInListById } from "../../../../utility/GameObjectHelpers";
import { GameObjectContext } from "../../Scg.types";
import "./classAvatar.scss";

interface ClassAvatarProps
{
    classId: number;
    style?: React.CSSProperties;
}

export function ClassAvatar(props: ClassAvatarProps)
{
    const gameObjects = useContext(GameObjectContext);
    if(props.classId === -1) return (
        <div style={props.style} className="Class Avatar margin-8">

        </div>
    );

    const playerClass = findObjectInList(
            gameObjects.classes,
            findById(props.classId)
        ) as PlayerClass;
    const [fullClass, partialClass] = findObjectsInListById(
            gameObjects.classDescriptions,
            [playerClass.full_class_id, playerClass.partial_class_id]
        ) as ClassDescription[];

    return (
        <div style={props.style} className="Class Avatar margin-8">
            <label>
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
            </label>
        </div>
    );
}
