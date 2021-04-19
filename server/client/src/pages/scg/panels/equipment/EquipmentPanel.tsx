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

    render() {
        return (
            <CharacterContext.Consumer>
            { character => (
                <div className="Equipment Panel">
                    <PanelHeader {...this.props} />
                    <h1>Equipment</h1>
                    <h2>{`Credits: ${character.character.inventory.credits}`}</h2>
                    <div style={{display: "flex", flexWrap: "wrap"}}>
                        { [...this.context.equipmentPackages.values()].map((pack: EquipmentPackage) =>
                        <div style={{margin: "4px"}} key={pack.id}>
                            <EquipmentPackageAvatar
                                style={{margin: "4px"}}
                                value={pack}
                                key={pack.id}
                                owned={character.character.inventory.equipmentPackageId === pack.id}
                                onChange={
                                    () => character.operations.inventory.setPack(
                                        character.character.inventory.equipmentPackageId === pack.id
                                        ? undefined
                                        : pack.id)
                                }
                            />
                        </div>
                        ) }
                    </div>
                </div>
            )}
            </CharacterContext.Consumer>
        );
    }
}