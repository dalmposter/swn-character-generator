import React, { Component } from "react";
import { EquipmentPanelProps, EquipmentPanelState } from "./EquipmentPanel.types";
import "../panels.scss";
import "./equipment.scss";
import { CharacterContext, GameObjectContext, GameObjectsContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { EquipmentPackage } from "../../../../types/Object.types";
import EquipmentPackageAvatar from "../../../../components/avatars/equipment/packages/equipmentPackageAvatar";

/**
 * Render panel for rolling gold and/or choosing/buying equipment
 */
export default class EquipmentPanel extends Component<EquipmentPanelProps, EquipmentPanelState>
{
    static contextType = GameObjectContext;
    context: GameObjectsContext;

    makePackageList()
    {
        let out = [];
        //console.log("package context", this.context.equipmentPackages);
        this.context.equipmentPackages.forEach((value: EquipmentPackage, key: number) =>
        {
            out.push(
                <div style={{margin: "4px"}} key={key}>
                    <EquipmentPackageAvatar value={value} key={key} />
                </div>
            );
        })
        return out;
    }

    render() {
        return (
            <CharacterContext.Consumer>
            { character => (
                <div className="Equipment Panel">
                    <PanelHeader {...this.props} />
                    <h1>Equipment</h1>
                    <h2>Packages</h2>
                    <div style={{display: "flex", flexWrap: "wrap"}}>
                        { this.makePackageList() }
                    </div>
                </div>
            )}
            </CharacterContext.Consumer>
        );
    }
}