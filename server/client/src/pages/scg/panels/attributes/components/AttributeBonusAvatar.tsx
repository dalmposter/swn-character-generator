import React from "react";
import "./attributeBonus.scss";
import { AttributeBonus } from "../../../../../types/Object.types";

interface AttributeBonusAvatarProps extends AttributeBonus
{
    style?: React.CSSProperties;
}

export function AttributeBonusAvatar(props: AttributeBonusAvatarProps)
{
    return (
        <div className="Attribute Bonus Avatar" style={props.style}>
            <h3>{`${props.name} (${props.remainingBonus}/${props.maxBonus} remaining)`}</h3>
        </div>
    );
}