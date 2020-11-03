import React, { Component } from "react";
import { AttributesPanelProps, AttributesPanelState } from "./AttributesPanel.types";
import "../panels.scss";
import "./attributes.scss";
import { Attribute } from "../../Scg.types";
import { AttributeAvatar } from "./components/AttributeAvatar";
import { AttributeBonus } from "../../../../types/Object.types";
import { AttributeBonusAvatar } from "./components/AttributeBonusAvatar";

export class AttributesPanel extends Component<AttributesPanelProps, AttributesPanelState>
{
    onModeChange = (event) => {
        this.props.setMode(event.currentTarget.value);
    }

    render() {
        return (
            <div className="Attributes">
                <h1>Attributes</h1>
                <div style={{ marginLeft: "48px", paddingBottom: "12px" }}>
                    <div className="ModeSelector">
                        <h2 style={{flex: "0.2", marginTop: "0"}}>Mode:</h2>
                        <div className="Vertical Radio" style={{flex: "0.8"}}>
                            <p>
                                <input type="radio" value="roll"
                                    name="attributeMode" checked={this.props.mode? this.props.mode === "roll" : true}
                                    onChange={this.onModeChange}
                                />
                                Roll 3d6 per attribute then set one to 14
                            </p>
                            <p>
                                <input type="radio" value="array"
                                    name="attributeMode" checked={this.props.mode === "array"}
                                    onChange={this.onModeChange}
                                />
                                { `Allocate ${this.props.attributeRuleset.array.join(", ")} as you choose` }
                            </p>
                        </div>
                    </div>
                    { this.props.attributeRuleset.attributes.map((attribute: Attribute) => {
                        return (<AttributeAvatar
                            { ...attribute }
                            value={this.props.currentAttributes.get(attribute.key)}
                        />);
                    }) }
                </div>
                <h1>Bonuses:</h1>
                <div style={{ marginLeft: "48px", paddingBottom: "12px" }}>
                    { this.props.currentBonuses.map((bonus: AttributeBonus, index: number) =>
                        <AttributeBonusAvatar key={`bonus-${index}`} {...bonus} style={{marginBottom: "4px"}} />) }
                    <button>Add custom bonus</button>
                </div>
            </div>
        );
    }
}