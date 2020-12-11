import React, { useContext } from "react";
import { Focus } from "../../../types/Object.types";
import { findObjectInMap } from "../../../utility/GameObjectHelpers";
import { GameObjectContext } from "../../../pages/scg/Scg.types";
import "./focusAvatar.scss";

interface FocusAvatarProps
{
    focusId: number;
    style?: React.CSSProperties;
    currentLevel?: number;
    addFocus?: () => void;
    removeFocus?: () => void;
    canPlus?: "combat" | "noncombat" | "any";
}

/**
 * Avatar for rendering a Focus
 */
export function FocusAvatar(props: FocusAvatarProps)
{
    const gameObjects = useContext(GameObjectContext);
    if(props.focusId === -1) return (
        <div style={props.style} className="Focus Avatar">

        </div>
    );
    const focus: Focus = findObjectInMap(
        props.focusId, gameObjects.foci);
        
    return (
        <div style={props.style} className="Focus Avatar padding-8">
            {   (props.currentLevel > 0 &&
                props.removeFocus) &&
                <button
                    style={{float: "right"}}
                    onClick={props.removeFocus}
                >
                    -
                </button>
            }
            {   (!(props.currentLevel > 2) &&
                (props.addFocus &&
                (props.canPlus === "any" ||
                    props.canPlus === (focus.is_combat
                                                ? "combat"
                                                : "noncombat")
                ))) &&
                <button
                    style={{float: "right"}}
                    onClick={props.addFocus}
                >
                    +
                </button>
            }
            <h2 style={{marginTop: "0", marginBottom: "4px"}}>
                { props.currentLevel
                    ? `${focus.name} - level ${props.currentLevel}`
                    : focus.name
                }
            </h2>
            <ol>
                <li className={props.currentLevel > 0? "description unlocked" : "description"}>{focus.level_1_description}</li>
                <li className={props.currentLevel > 1? "description unlocked" : "description"}>{focus.level_2_description}</li>
            </ol>
        </div>
    );
}
