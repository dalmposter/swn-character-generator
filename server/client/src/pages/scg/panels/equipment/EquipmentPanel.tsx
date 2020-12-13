import React, { Component } from "react";
import { EquipmentPanelProps, EquipmentPanelState } from "./EquipmentPanel.types";
import "../panels.scss";
import "./equipment.scss";
import { CharacterContext, GameObjectContext, GameObjectsContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { EquipmentPackage } from "../../../../types/Object.types";

/**
 * Render panel for rolling gold and/or choosing/buying equipment
 * Allows changing of generation mode, deciding of attributes, and application of bonuses
 */
export default class EquipmentPanel extends Component<EquipmentPanelProps, EquipmentPanelState>
{
    static contextType = GameObjectContext;
    context: GameObjectsContext;

    makePackageList()
    {
        let out = [];
        this.context.equipmentPackages.forEach((value: EquipmentPackage, key: number) =>
        {
            out.push(<p key={value.id}>{value.name}</p>);
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
                    <div>
                        { this.makePackageList() }
                    </div>
                </div>
            )}
            </CharacterContext.Consumer>
        );
    }
}