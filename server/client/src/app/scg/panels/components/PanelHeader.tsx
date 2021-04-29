import React from "react";

export interface PanelHeaderProps
{
    onReset?: () => void;
    onHelp?: () => void;
}

/**
 * Common header for all panels. Contains a help button and panel reset button
 */
export default function PanelHeader(props: PanelHeaderProps)
{
    return (
        <div style={{ position: "relative" }}>
            {/*<div style={{ position: "absolute", top: "0", right: "0", zIndex: 10 }}>
                <button
                    onClick={ props.onReset }
                >
                    Reset
                </button>
                <button
                    onClick={ props.onHelp }
                >
                    i
                </button>
            </div>*/}
        </div>
    );
}