import React, { Component } from "react";
import { AttributeBonus } from "../../../../types/Object.types";
import { CharacterContext } from "../../Scg.types";

/**
 * Create a list of attribute bonuses
 */
export default class AttributesBonuses extends Component<{}, {}>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    render()
    {
        let out = [];
        ["any", "physical", "mental"].forEach(
            (key) => out.push(
                <h3 className="flex grow" key={key}>
                    {`${this.context.character.attributes.remainingBonuses[key]} ${key}`}
                </h3>
            )
        )
        
        return (
        <>
            <div>
                <h2>Remaining Bonuses:</h2>
                <div className="flexbox" style={{marginLeft: "42px", marginRight: "42px"}}>
                    { out }
                </div>
            </div>
            { /*<h2>Bonuses:</h2>
            <div style={{marginLeft: "24px", marginRight: "24px", display: "flex", flexWrap: "wrap"}}>
                { this.context.character.attributes.bonuses.map((bonus: AttributeBonus, index: number) =>
                <div style={{marginLeft: "18px", marginRight: "18px"}} key={`bonus-${index}`} >
                    <p>
                        {bonus.name}
                    </p>
                </div>
                ) }
                </div>*/ }
        </>
        );
    }
}