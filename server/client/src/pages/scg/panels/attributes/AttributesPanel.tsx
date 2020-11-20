import React, { Component } from "react";
import { AttributesPanelProps, AttributesPanelState } from "./AttributesPanel.types";
import "../panels.scss";
import "./attributes.scss";
import { Attribute, AttributeMode, RollMode } from "../../Scg.types";
import { AttributeBonus } from "../../../../types/Object.types";
import { AttributeAvatar } from "../../avatars/attributes/AttributeAvatar";
import { AttributeBonusAvatar } from "../../avatars/attributes/AttributeBonusAvatar";

export class AttributesPanel extends Component<AttributesPanelProps, AttributesPanelState>
{
    constructor(props: AttributesPanelProps)
    {
        super(props);
        try
        {
            if(!props.mode) props.setMode(this.getCurrentMode().key);
        }
        catch(err)
        {
            console.warn("Exceptional mode situation :: attributes", err);
        }
    }

    onModeChange = (event) => {
        this.props.setMode(event.currentTarget.value);
        this.setState({activeMode: this.props.attributeRuleset.modes.find((value: AttributeMode) => value.key === event.currentTarget.value)})
    }

    doRoll = (dice: number, sides: number) => {
        return Array.from(Array(dice).keys()).map((_: number) => Math.floor(Math.random() * sides) + 1)
    }

    getCurrentMode = () => {
        if(this.props.mode)
        {
            let foundMode = this.props.attributeRuleset.modes.find((value: AttributeMode) => value.key === this.props.mode);
            if(foundMode) return foundMode;
        }
        if(this.props.attributeRuleset.modes.length > 0) return this.props.attributeRuleset.modes[0];
        return null;
    }

    getModeDescription = (mode: AttributeMode) => {
        return mode.type === "array"? 
        `Allocate ${mode.array.join(", ")} as you choose`
        :
        mode.type === "roll"?
            `Roll ${mode.dice}d${mode.sides} per attribute then set ${mode.fixedValues.length} to ${mode.fixedValues.join(",")}`
            :
            `Roll ${mode.dice}d${mode.sides} per attribute. Arrange them however you want${mode.fixedValues && mode.fixedValues.length > 0
                ? " then set " + mode.fixedValues.length + " to " + mode.fixedValues.join(",")
                : ""
            }`
    }

    render() {
        let currentMode = this.getCurrentMode();
        return (
            <div className="Attributes">
                <h1>Attributes</h1>
                <div style={{ marginLeft: "48px", paddingBottom: "12px" }}>
                    <div className="ModeSelector">
                        <h2 style={{flex: "0.2", marginTop: "0"}}>Mode:</h2>
                        <div className="Vertical Radio" style={{flex: "0.8"}}>
                            { this.props.attributeRuleset.modes.map((mode: AttributeMode) => <p key={`p-${mode.key}`}>
                                <input type="radio" value={mode.key} key={`input-${mode.key}`}
                                    name="attributeMode" checked={this.props.mode === mode.key}
                                    onChange={this.onModeChange}
                                />
                                { this.getModeDescription(mode) }
                            </p>) }
                        </div>
                    </div>
                    { this.props.attributeRuleset.attributes.map((attribute: Attribute) => {
                        return (
                        <AttributeAvatar
                            { ...attribute }
                            attributeKey={ attribute.key }
                            allocateOptions={currentMode.type === "array"? currentMode.array : null}
                            value={this.props.currentAttributes.get(attribute.key)}
                            setStat={(value: number) => { 
                                let newAttributes = this.props.currentAttributes;
                                newAttributes.set(attribute.key, value);
                                this.props.saveAttributes(newAttributes);
                            }}
                            doRoll={ ["roll", "hybrid"].includes(currentMode.type)?
                                () => this.doRoll((
                                    currentMode as RollMode).dice, (currentMode as RollMode).sides)
                                :
                                null
                            }
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