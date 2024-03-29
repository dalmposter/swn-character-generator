import React, { Component } from "react";
import { AttributesPanelProps, AttributesPanelState } from "./AttributesPanel.types";
import { CharacterContext } from "../../Scg.types";
import { Attribute } from "../../../../types/Object.types";
import { AttributeMode } from "../../../../types/ruleset.types";
import { Button, Modal } from "rsuite";
import "./attributes.scss";
import { attributesRulesExcerptLong, attributesRulesExcerptShort } from "./AttributeDescriptions";
import PanelFrame from "../panel/PanelFrame";

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
        this.state = this.getNewState(this.props.defaultMode);
    }

    componentDidMount()
    {
        console.log("Component mount", this.context.character.attributes.mode);
        this.setState(this.getNewState(this.context.character.attributes.mode));
        
        let newAllocate = true;
            this.props.attributeRuleset.attributes.forEach(value => {
                if(!this.context.character.attributes.rolledValues.get(value.key)) newAllocate = false;
            });
        this.setState({canAllocate: newAllocate});
    }

    getNewState = (newMode: AttributeMode) => {        
        return {
            mode: newMode,
            allocateOptions: newMode.type === "array"? newMode.array
                : newMode.type === "roll"? newMode.fixedValues
                    : [...this.context.character.attributes.rolledValues.values()]
                        .filter(x => x!==0),
            canAllocate: newMode.type === "array"? true : false,
            canRoll: newMode.type === "array"? false : true,
        };
    }

    changeMode = (newMode: AttributeMode) => {
        this.setState(this.getNewState(newMode));
        this.context.operations.attributes.setMode(newMode);
        this.context.operations.attributes.resetAttributes();
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
        <div className="Attribute Avatar" key={attribute.key}>
            <Button size="xs"
                className="info-button"
                onClick={() => this.context.operations.meta.setActiveModal({
                    header: <Modal.Header>
                                <Modal.Title style={{textAlign: "center"}}>
                                    { attribute.name }
                                </Modal.Title>
                            </Modal.Header>,
                    body:	<Modal.Body style={{paddingBottom: "16px"}} className="flexbox">
                                <p>{ attribute.description }</p>
                            </Modal.Body>,
                    backdrop: false,
                })}
            >
                ?
            </Button>
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
                    <h2 style={{marginLeft: "4px", minWidth: "max-content"}}>
                        {`+ ${statBonus} = ${statValue + statBonus || 0}` }
                    </h2>
                </div>
                // Otherwise just display the value
                :
                <h2 style={{textAlign: "center", minWidth: "124px"}}>
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
        </div>);
    }

    render()
    {
        let out = [];
        ["any", "physical", "mental"].forEach(
            (key) => out.push(
                <h3 className="flex grow" key={key} style={{marginLeft: "16px", whiteSpace: "nowrap"}}>
                    {`${this.context.character.attributes.remainingBonuses[key]} ${key}`}
                </h3>
            )
        )

        return (
            <PanelFrame
                descriptionLong={attributesRulesExcerptLong}
                descriptionShort={attributesRulesExcerptShort}
                title="Attributes"
                className="Attributes"
            >
                <div className="ModeSelector">
                    <h2 style={{marginTop: "0", marginRight: "16px"}}>Mode:</h2>
                    <div className="Vertical Radio flex grow">
                        { this.props.attributeRuleset.modes.map((mode: AttributeMode) =>
                        <p key={`p-${mode.key}`}>
                            <input type="radio" value={mode.key} key={`input-${mode.key}`}
                                name="attributeMode" checked={this.state.mode === mode}
                                onChange={() => this.changeMode(mode)}
                            />
                            { this.getModeDescription(mode) }
                        </p>) }
                    </div>
                </div>
                <div className="flexbox">
                    <div>
                        { this.props.attributeRuleset.attributes.map(this.makeAttributeAvatar) }
                    </div>
                    <div>
                        <div className="attribute-bonuses">
                            <h3>Bonuses:</h3>
                            { out }
                        </div>
                    </div>
                </div>
            </PanelFrame>
        );
    }
}