import React from "react";

export interface PanelHeaderProps
{
    onReset?: () => void;
    onHelp?: () => void;
}

export default function PanelHeader(props: PanelHeaderProps)
{
    return (
        <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: "0", right: "0" }}>
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
            </div>
        </div>
    );
}