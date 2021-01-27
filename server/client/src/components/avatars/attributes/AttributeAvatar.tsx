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

    children?: JSX.Element[];
    elementAfter?: JSX.Element;
}

/**
 * Avatar for rendering a roll/selection tab for one attribute
 * Includes stat name, value, and inputs
 * Takes the whole attribute as props so is a dumb render
 */
export function AttributeAvatar(props: AttributeAvatarProps)
{
    const [ roll, setRoll ] = useState([]);

    return (
        <div style={{display: "flex"}}>
            <div className="Attribute Avatar">
                <h3>{ props.name }</h3>
                { props.allocateOptions ?
                    // If the player has opted to allocate stats, render a dropdown list
                        <select name={props.name} id={props.attributeKey}
                            onChange={ (e: React.ChangeEvent) => props.setStat(parseInt(e.target["value"]))}
                            defaultValue={props.value? props.value : "-"}
                        >
                            { [...props.allocateOptions, "-"].map((value: number, index: number) =>
                                <option value={value} key={index}>{value}</option>) }
                        </select>
                    // Otherwise just display the value
                    :   <h3 style={{textAlign: "center"}}>
                            { props.value? props.value : "-" }
                        </h3>
                }
                { props.children }
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
            { props.elementAfter }
            { roll &&
            <div className="Attribute Roll">
                <p>{ roll.join(", ") }</p>
            </div> }
        </div>
    );
}