import React from "react";
import "./footer.scss";

/**
 * Footer for every page. Contains links and info
 */
export default function Footer()
{
    return(
    <div className="Footer">
        <div>
            <a href="./wiki">Wiki</a>
            { "  .  " }
            <a href="./scg">Character Generator</a>
            { "  .  " }
            <a href="./">Home</a>
        </div>
        <div>
            <p>
                {"SWN Character Generator created by Dominic Cousins "}
                <a href="https://github.com/dalmposter">@github/dalmposter</a>
            </p>
        </div>
    </div>
    );
}