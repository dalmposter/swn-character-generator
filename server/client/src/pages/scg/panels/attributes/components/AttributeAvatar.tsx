import React from "react";
import "./attributeAvatar.scss";

interface AttributeAvatarProps
{
    name: string;
    key: string;
    description: string;
    value?: number;
}

export function AttributeAvatar(props: AttributeAvatarProps)
{
    return (
        <div className="Attribute Avatar">
            <h3>{ props.name }</h3>
            <h3 style={{textAlign: "center"}}>{ props.value? props.value : "-" }</h3>
            <div className="IncDec Buttons">
                <button>+</button>
                <button>-</button>
            </div>
            <div className="Roll Buttons">
                <button>roll</button>
            </div>
        </div>
    );
}