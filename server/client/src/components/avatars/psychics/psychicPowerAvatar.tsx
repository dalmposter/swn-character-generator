import React, { useContext } from "react";
import { GameObjectContext } from "../../../pages/scg/Scg.types";
import { PsychicPower } from "../../../types/Object.types";
import { findObjectInMap } from "../../../utility/GameObjectHelpers";
import "./psychicPowerAvatar.scss";

export interface PsychicPowerAvatarProps
{
    id: number;
    className?: string;
    isCore?: boolean;
    owned?: boolean;
    unavailable?: boolean;
    disabled?: boolean;
    addPower?: () => void;
    removePower?: () => void;
}

/**
 * Avatar for 1 psychic power within a discipline
 */
export default function PsychicPowerAvatar(props: PsychicPowerAvatarProps)
{
    const gameObjects = useContext(GameObjectContext);
    const power: PsychicPower = findObjectInMap(props.id,
        gameObjects.psychicPowers);

    return props.isCore
    ? (
        <div className={`Psychic Avatar padding-4
            ${props.className? ` ${props.className}` : ""}`}
        >
            <h4 style={{margin: "8px 0"}}>{ power.name }</h4>
            <div className="no-margins" style={{overflowY: "auto"}}>
                <p>{ power.description.substring(power.description.indexOf("Level-0:")) }</p>
            </div>
        </div>
    ) : (
        <label>
            <div className={`Psychic Avatar Power padding-4
                ${props.className? ` ${props.className}` : ""}
                ${props.owned === true? " Owned" : props.owned === false? " Unowned" : ""}
                ${props.unavailable? " Unavailable" : ""}`}
            >
                { props.owned != null &&
                    <input type="checkbox"
                        style={{float: "right"}}
                        checked={props.owned}
                        disabled={props.unavailable || props.disabled}
                        onClick={
                            props.owned
                            ? props.removePower
                            : props.addPower
                        }
                    />
                }
                <h4>{ power.name }</h4>
            </div>
        </label>
    )
}