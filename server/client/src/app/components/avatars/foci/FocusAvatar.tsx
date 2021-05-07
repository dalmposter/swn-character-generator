import React, { useContext } from "react";
import { Focus } from "../../../../types/object.types";
import { findObjectInMap } from "../../../../utility/GameObjectHelpers";
import { GameObjectContext } from "../../../scg/Scg.types";
import "./focusAvatar.scss";

interface FocusAvatarLargeProps
{
    focusId: number;
    style?: React.CSSProperties;
    currentLevel?: number;
    addFocus?: () => void;
    removeFocus?: () => void;
    canPlus?: "combat" | "noncombat" | "any";
    size: "large";
}

interface FocusAvatarSmallProps
{
    focusId: number;
    style?: React.CSSProperties;
    currentLevel?: number;
    addFocus?: () => void;
    removeFocus?: () => void;
    canPlus?: "combat" | "noncombat" | "any";
    size: "small";
}

export type FocusAvatarProps = FocusAvatarSmallProps | FocusAvatarLargeProps;

function FocusAvatarSmall(props: FocusAvatarSmallProps)
{
    return (
        <div>
            <p>{props.focusId}</p>
        </div>
    );
}

/**
 * Avatar for rendering a Focus. Name and level 1 and 2 abilities
 * Takes ID and fetches the focus to render
 */
function FocusAvatarLarge(props: FocusAvatarProps)
{
    const gameObjects = useContext(GameObjectContext);

    // Don't render the dummy id
    if(props.focusId === -1) return (
        <div style={props.style} className="Focus Avatar">

        </div>
    );
    const focus: Focus = findObjectInMap(
        props.focusId, gameObjects.foci);
        
    return (
        <div style={props.style} className="Focus Avatar padding-8">
            { // We can only remove a focus if the level is not 0 and we have a remove function
                (props.currentLevel > 0 &&
                props.removeFocus) &&
                <button
                    style={{float: "right"}}
                    onClick={props.removeFocus}
                >
                    -
                </button>
            }
            { // Can only add a focus if the level is less than 2 and we have points and a function
                (!(props.currentLevel > 2) &&
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

export default function FocusAvatar(props: FocusAvatarProps)
{
    switch(props.size)
    {
        case "small":
            return <FocusAvatarSmall {...props} />;
        case "large":
            return <FocusAvatarLarge {...props} />;
        default:
            return <FocusAvatarSmall {...props} />;
    }
}