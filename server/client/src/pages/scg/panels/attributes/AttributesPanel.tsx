import React, { Component } from "react";
import { AttributesPanelProps, AttributesPanelState } from "./AttributesPanel.types";
import "../panels.scss";
import "./attributes.scss";
import { CharacterContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import AttributesBonuses from "./AttributesBonuses";
import { Attribute } from "../../../../types/Object.types";
import { AttributeMode } from "../../ruleset.types";

/**
 * Render panel for generating attributes
 * Allows changing of generation mode, deciding of attributes, and application of bonuses
 */
export default class AttributesPanel extends Component<AttributesPanelProps, AttributesPanelState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    constructor(props: AttributesPanelProps)
    {
        super(props);
        let initialMode = this.props.defaultMode
            ? this.props.attributeRuleset.modes.find((value: AttributeMode) => value.key === this.props.defaultMode)
            : this.props.attributeRuleset.modes[0];
        this.state = this.getNewState(initialMode);
    }

    getNewState = (newMode: AttributeMode) => {
        return {
            mode: newMode,
            allocateOptions: newMode.type === "array"? newMode.array
                : newMode.type === "roll"? newMode.fixedValues
                    : [], //TODO: initialise this with initial value of stats (loading characters)
            canAllocate: newMode.type === "array"? true : false,
            canRoll: newMode.type === "array"? false : true,
            canModify: newMode.type === "roll"? true : false,
        };
    }

    changeMode = (newMode: AttributeMode) => {
        this.setState(this.getNewState(newMode));
        this.context.operations.attributes.setMode(newMode.key);
        this.props.onReset();
    }

    onModeChange = (event) => {
        this.changeMode(this.props.attributeRuleset.modes.find((value: AttributeMode) => value.key === event.currentTarget.value));
    }

    /**
     * Roll a number of dice with given sides
     * @param dice 
     * @param sides 
     */
    doRoll = (dice: number, sides: number) => {
        return Array.from(Array(dice).keys()).map((_: number) => Math.floor(Math.random() * sides) + 1)
    }

    /**
     * Generate a string description for the given generation mode
     */
    getModeDescription = (mode: AttributeMode): string => {
        return mode.type === "array"? 
        `Allocate ${mode.array.join(", ")} as you choose`
        :
        mode.type === "roll"?
            `Roll ${mode.dice}d${mode.sides} per attribute then set ${mode.fixedValues.length} to ${mode.fixedValues.join(",")}`
            :
            `Roll ${mode.dice}d${mode.sides} per attribute. Arrange them however you want${
                mode.fixedValues && mode.fixedValues.length > 0
                ? " then set " + mode.fixedValues.length + " to " + mode.fixedValues.join(",")
                : ""
            }`
    }

    setStat = (attributeKey: string, newValue: number, isRoll = false) => {
        let oldValue = this.context.character.attributes.rolledValues.get(attributeKey);
        this.context.operations.attributes.setStat(attributeKey, newValue);
        // If the user is allowed to rearrange the stats, we made need to swap the new value for another
        // To ensure they are allocating each number the correct quantity of times
        if(this.state.mode.type === "array" || (this.state.mode.type === "hybrid" && !isRoll))
        {
            if(this.state.allocateOptions.filter(value => value === newValue).length
                < [...this.context.character.attributes.rolledValues.values()]
                    .filter(value => value === newValue).length)
            {
                let replaceKey = [...this.context.character.attributes.rolledValues.entries()]
                    .find((entry) => entry[1] === newValue && entry[0] !== attributeKey)[0];
                this.context.operations.attributes.setStat(replaceKey, oldValue);
            }
        }
        // If we are in a rolling/hybrid mode, enable allocation after all stats have values
        else if(!this.state.canAllocate)
        {
            let newAllocate = true;
            this.props.attributeRuleset.attributes.forEach(value => {
                if(!this.context.character.attributes.rolledValues.get(value.key)) newAllocate = false;
            });
            this.setState({canAllocate: newAllocate});
        }
        // If the mode is roll and this setting is not from a roll
        // Determine its impact on stat allocation
        if(this.state.mode.type === "roll" && !isRoll)
        {
            let allocateOptions = this.state.allocateOptions.filter(value => value !== newValue);
            let workingArray = this.state.allocateOptions.filter(value => value === newValue);
            workingArray.pop();
            if(workingArray.length > 0) allocateOptions.concat(workingArray);
            let canAllocate = this.state.canAllocate && allocateOptions.length > 0;
            this.setState({canAllocate, allocateOptions});
        }
    }

    makeAttributeAvatar = (attribute: Attribute) =>
    {
        let statValue = this.context.character.attributes.rolledValues.has(attribute.key)
                            ? this.context.character.attributes.rolledValues.get(attribute.key)
                            : 0;
        let statBonus = this.context.character.attributes.bonusValues.has(attribute.key)
                            ? this.context.character.attributes.bonusValues.get(attribute.key)
                            : 0;
        let currentMode = this.state.mode;

        let options: any[] = [...this.state.allocateOptions];
        if(currentMode.type !== "roll") options.push("-");
        if(!options.includes(statValue) && statValue) options.push(statValue);

        return (
        <div style={{display: "flex"}} key={attribute.key}>
            <div className="Attribute Avatar">
                <h3>{ attribute.name }</h3>
                { this.state.allocateOptions && this.state.canAllocate ?
                    // If the player has opted to allocate stats, render a dropdown list
                    <div className="flexbox">
                        <select name={attribute.name} id={attribute.key}
                            style={{maxHeight: "24px", marginTop: "auto", marginBottom: "auto"}}
                            onChange={(e: React.ChangeEvent) => this.setStat(attribute.key, parseInt(e.target["value"]))}
                            value={statValue? statValue : "-"}
                        >
                            { options.map((value: number, index: number) =>
                                <option value={value} key={index}>{value}</option>) }
                        </select>
                        <h2 style={{marginLeft: "4px"}}>
                            {`+ ${statBonus} = ${statValue + statBonus || 0}` }
                        </h2>
                    </div>
                    // Otherwise just display the value
                    :
                    <h2 style={{textAlign: "center"}}>
                        { statValue? statValue : "-" } + { statBonus } = { statBonus + statValue }
                    </h2>
                }
                <div className="flexbox">
                    <div className="IncDec Buttons">
                        <button
                            disabled={
                                this.context.character.attributes.remainingBonuses[attribute.type] <= 0
                                && this.context.character.attributes.remainingBonuses.any <= 0
                            }
                            onClick={() => this.context.operations.attributes.incrementBonusValue(attribute)}
                        >+</button>
                        <button
                            disabled={ statBonus <= 0 }
                            onClick={() => this.context.operations.attributes.decrementBonusValue(attribute)}
                        >-</button>
                    </div>
                    <button className="Roll Buttons"
                        disabled={ !this.state.canRoll || statValue !== 0 }
                        onClick={() => {
                            let newRoll = this.doRoll(
                                currentMode.dice,
                                currentMode.sides
                            ).reduce((prev: number, curr: number) => prev + curr);
                            this.setStat(attribute.key, newRoll, true);
                            if(this.state.mode.type === "hybrid")
                            {
                                this.setState({
                                    allocateOptions: [...this.state.allocateOptions, newRoll]
                                });
                            }
                        }}
                    >roll</button>
                    <h2 style={{marginLeft: "24px", marginRight: "12px"}}>
                        {`(${this.context.operations.attributes.getModifier(attribute.key)})`}
                    </h2>
                </div>
            </div>
        </div>);
    }

    render() {

        return (
            <div className="Attributes Panel">
                <PanelHeader {...this.props} onReset={() => {
                    this.props.onReset();
                    this.setState({allocateOptions: []})}}
                />
                <h1>Attributes</h1>
                <div>
                    <div className="ModeSelector">
                        <h2 style={{flex: "0.2", marginTop: "0"}}>Mode:</h2>
                        <div className="Vertical Radio" style={{flex: "0.8"}}>
                            { this.props.attributeRuleset.modes.map((mode: AttributeMode) => <p key={`p-${mode.key}`}>
                                <input type="radio" value={mode.key} key={`input-${mode.key}`}
                                    name="attributeMode" checked={this.state.mode === mode}
                                    onChange={this.onModeChange}
                                />
                                { this.getModeDescription(mode) }
                            </p>) }
                        </div>
                    </div>
                    { this.props.attributeRuleset.attributes.map(this.makeAttributeAvatar) }
                </div>
                <AttributesBonuses />
                { false && <button>Add custom bonus</button> }
            </div>
        );
    }
}