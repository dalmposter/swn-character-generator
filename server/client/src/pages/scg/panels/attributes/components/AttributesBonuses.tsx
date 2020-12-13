import React from "react";
import { AttributeBonus } from "../../../../../types/Object.types";
import { AttributeBonusAvatar } from "../../../../../components/avatars/attributes/AttributeBonusAvatar";

/**
 * Create a list of attribute bonuses
 */
export default function AttributesBonuses(props: { currentBonuses: AttributeBonus[] })
{
    return (
    <>
        <h2>Bonuses:</h2>
        <div style={{ marginLeft: "48px", paddingBottom: "12px" }}>
            { props.currentBonuses.map((bonus: AttributeBonus, index: number) =>
                <AttributeBonusAvatar key={`bonus-${index}`} {...bonus} style={{marginBottom: "4px"}} />) }
            <button>Add custom bonus</button>
        </div>
    </>
    );
}