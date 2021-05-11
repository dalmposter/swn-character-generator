import React from "react";
import { Checkbox } from "rsuite";
import { EquipmentPackage } from "../../../../../types/Object.types";
import ItemAvatar from "../itemAvatar";
import "./equipmentPackageAvatar.scss";

interface EquipmentPackageAvatarProps
{
    value: EquipmentPackage;
    owned: boolean;
    onChange: () => void;
    style?: React.CSSProperties;
}

/**
 * 
 */
export default function EquipmentPackageAvatar(props: EquipmentPackageAvatarProps)
{
    return (
        <label>
            <div className="Equipment Avatar" style={props.style}>
                <div className="no-margins padding-4">
                    <Checkbox
                        checked={props.owned}
                        onChange={props.onChange}
                    />
                    <h3>{ props.value.name }</h3>
                    <p>{`${props.value.credits} credits`}</p>
                    { Object.keys(props.value.contents).map(itemType =>
                        {
                            return [...props.value.contents[itemType].keys()].map(itemId =>
                                <ItemAvatar
                                    type={itemType}
                                    id={itemId}
                                    quantity={props.value.contents[itemType].get(itemId)}
                                    size="small"
                                    key={`${itemType}-${itemId}`}
                                />
                            );
                        }
                    )}
                </div>
            </div>
        </label>
    );
}