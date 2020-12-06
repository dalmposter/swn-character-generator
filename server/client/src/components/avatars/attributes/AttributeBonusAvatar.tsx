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

export function AttributeBonusAvatar(props: AttributeBonusAvatarProps)
{
    return (
        <div className="Attribute Bonus Avatar" style={props.style}>
            <h4>{`${props.name} (${props.remainingBonus}/${props.maxBonus} remaining)`}</h4>
            <div className="Attribute Bonus Avatar">
                { props.onDelete && <button>delete</button> }
                { props.onNav && <button>{"->"}</button> }
                { props.onUse && <button>+</button> }
                <button>i</button>
            </div>
        </div>
    );
}