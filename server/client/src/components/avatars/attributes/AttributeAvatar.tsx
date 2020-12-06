import React, { useState } from "react";
import "./attributeAvatar.scss";

interface AttributeAvatarProps
{
    name: string;
    attributeKey: string;
    description: string;
    value?: number;
    canUp?: boolean;
    canDown?: boolean;
    doRoll?: () => number[];
    allocateOptions?: number[];
    setStat: (_: number) => void;
}


export function AttributeAvatar(props: AttributeAvatarProps)
{
    const [ roll, setRoll ] = useState([]);

    return (
        <div style={{display: "flex"}}>
            <div className="Attribute Avatar">
                <h3>{ props.name }</h3>
                { props.allocateOptions?
                    <select name={props.name} id={props.attributeKey}
                        onChange={ (e: React.ChangeEvent) => props.setStat(e.target["value"])}
                    >
                        { props.allocateOptions.map((value: number, index: number) =>
                            <option value={value} key={index}>{value}</option>) }
                    </select>
                    :
                    <h3 style={{textAlign: "center"}}>{ props.value? props.value : "-" }</h3>
                }
                <div className="IncDec Buttons">
                    <button
                        disabled={!props.canUp}
                        onClick={() => props.setStat(props.value + 1)}
                    >+</button>
                    <button
                        disabled={!props.canDown}
                        onClick={() => props.setStat(props.value - 1)}
                    >-</button>
                </div>
                <div className="Roll Buttons">
                    <button
                        disabled={!props.doRoll}
                        onClick={() => {
                            let newRoll = props.doRoll();
                            setRoll(newRoll);
                            props.setStat(newRoll.reduce((prev: number, curr: number) => prev + curr));
                        }}
                    >roll</button>
                </div>
            </div>
            { roll &&
            <div className="Attribute Roll">
                <p>{ roll.join(", ") }</p>
            </div> }
        </div>
    );
}