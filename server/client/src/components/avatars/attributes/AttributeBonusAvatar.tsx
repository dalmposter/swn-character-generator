import React from "react";
import { AttributeBonus } from "../../../types/Object.types";
import "./attributeAvatar.scss";

interface AttributeBonusAvatarProps extends AttributeBonus
{
    style?: React.CSSProperties;
    onDelete?: () => void;
    onNav?: () => void;
    onUse?: () => void;
}

/**
 * Represents one attribute bonus. Usually these allow adding 2 points to certain stats
 * Takes the whole bonus as props so is a dumb render
 */
export function AttributeBonusAvatar(props: AttributeBonusAvatarProps)
{
    return (
        <div className="Attribute Bonus Avatar" style={props.style}>
            <h4>{`${props.name} (${props.remainingBonus}/${props.maxBonus} remaining)`}</h4>
            <div className="Attribute Bonus Avatar">
                { /* Render buttons for all functions given in props */ }
                { props.onDelete && <button>delete</button> }
                { props.onNav && <button>{"->"}</button> }
                { props.onUse && <button>+</button> }
                <button>i</button>
            </div>
        </div>
    );
}