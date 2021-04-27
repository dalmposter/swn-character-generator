import React from "react";
import "./header.scss";

/**
 * Header for each page. Contains navigation
 */
export default function Header()
{
    return(
    <div className="Header">
        <div>
            <a href="./wiki">Wiki</a>
            { "  .  " }
            <a href="./scg">Character Generator</a>
            { "  .  " }
            <a href="./">Home</a>
        </div>
    </div>
    );
}