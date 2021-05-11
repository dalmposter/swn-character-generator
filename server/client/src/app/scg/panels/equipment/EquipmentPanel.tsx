import React, { Component } from "react";
import { EquipmentPanelProps, EquipmentPanelState } from "./EquipmentPanel.types"
import "./equipment.scss";
import { CharacterContext, GameObjectContext, GameObjectsContext } from "../../Scg.types";
import { EquipmentPackage } from "../../../../types/Object.types";
import EquipmentPackageAvatar from "../../../components/avatars/equipment/packages/equipmentPackageAvatar";
import PanelFrame from "../panel/PanelFrame";

/**
 * Render panel for rolling gold and/or choosing/buying equipment
 */
export default class EquipmentPanel extends Component<EquipmentPanelProps, EquipmentPanelState>
{
    static contextType = GameObjectContext;
    context: GameObjectsContext;

    descriptionShort = "Choose one of the equipment packages on page 25 or roll 2d6 x 100 to find out how many starting credits you have with which to buy gear. If you wish to buy gear, the prices and available inventory is up the GM of your session. You may roll and buy items at your first play session!";

    render() {
        return (
            <CharacterContext.Consumer>
            { characterContext => (
                <PanelFrame
                    descriptionShort={this.descriptionShort}
                    title="Equipment Packages"
                    className="Equipment"
                >
                    <div className="Equipment Panel content">
                        <h2 style={{position: "absolute", top: "-42px", left: "16px"}}>
                            {`Credits: ${characterContext.character.inventory.credits}`}
                        </h2>
                        <div style={{display: "flex", flexWrap: "wrap"}}>
                            { [...this.context.equipmentPackages.values()].map((pack: EquipmentPackage) =>
                            <div className="avatar-container" key={pack.id}>
                                <EquipmentPackageAvatar
                                    value={pack}
                                    key={pack.id}
                                    owned={characterContext.character.inventory.equipmentPackageId === pack.id}
                                    onChange={
                                        () => characterContext.operations.inventory.setPack(
                                            characterContext.character.inventory.equipmentPackageId === pack.id
                                            ? undefined
                                            : pack.id)
                                    }
                                />
                            </div>
                            ) }
                        </div>
                    </div>
                </PanelFrame>
            ) }
            </CharacterContext.Consumer>
        );
    }
}