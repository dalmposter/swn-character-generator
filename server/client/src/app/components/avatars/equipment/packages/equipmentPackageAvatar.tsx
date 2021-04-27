import React from "react";
import { Checkbox } from "rsuite";
import { EquipmentPackage } from "../../../../../types/object.types";
import ItemAvatar from "../itemAvatar";
import "./equipmentPackageAvatar.scss";

interface EquipmentPackageAvatarProps
{
    value: EquipmentPackage;
    owned: boolean;
    onChange: () => void;
    style: React.CSSProperties;
}

/**
 * 
 */
export default function EquipmentPackageAvatar(props: EquipmentPackageAvatarProps)
{
    return (
        <div className="Equipment Avatar" style={props.style}>
            <label>
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
            </label>
        </div>
    );
}