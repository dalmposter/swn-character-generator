import React from "react";
import { EquipmentPackage } from "../../../../types/Object.types";
import ItemAvatar from "../itemAvatar";
import "./equipmentPackageAvatar.scss";

interface EquipmentPackageAvatarProps
{
    value: EquipmentPackage;
}

/**
 * 
 */
export default function EquipmentPackageAvatar(props: EquipmentPackageAvatarProps)
{
    return (
        <div className="Equipment Avatar">
            <div className="no-margins padding-4">
                <h3>{ props.value.name }</h3>
                <p>{`${props.value.credits} credits`}</p>
                { Object.keys(props.value.contents).map(itemType =>
                    {
                        return Object.keys(props.value.contents[itemType]).map(itemId =>
                            <ItemAvatar
                                type={itemType}
                                id={parseInt(itemId)}
                                quantity={props.value.contents[itemType][itemId]}
                                size="small"
                                key={`${itemType}-${itemId}`}
                            />
                        );
                    }
                )}
            </div>
        </div>
    );
}