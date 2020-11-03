import React, { Component } from 'react';
import { AttributesPanel } from './panels/attributes/AttributesPanel';
import "./scg.scss";
import { ScgProps, ScgState, defaultRules } from './Scg.types';

class Scg extends Component<ScgProps, ScgState>
{
	constructor(props: ScgProps)
	{
		super(props);
		this.state = {
			character: {
				attributes: {
					values: new Map(Object.entries({dex: 14, str: 12, con: 10, int: 12, wis: 9, cha: 7})),
					mode: "roll",
					bonuses: [{
						skillId: 23,
						name: "+2 Physical",
						description: "Gain 2 physical stats",
						type: "physical",
						maxBonus: 2,
						remainingBonus: 2,
					},
					{
						skillId: 24,
						name: "+2 Mental",
						description: "Gain 2 mental stats",
						type: "mental",
						maxBonus: 2,
						remainingBonus: 2,
					}],
				}
			},
		};
	}

	render()
	{
		return (
		<div className="Scg">
			<h1>SWN Character Generator</h1>
			<p>Tool goes here</p>
			<br />
			<AttributesPanel
				attributeRuleset={this.state.ruleset? this.state.ruleset.attributes : defaultRules.attributes}
				saveAttributes={attributes => {
					let character = this.state.character;
					character.attributes.values = attributes;
					this.setState({ character });
				}}
				currentAttributes={this.state.character.attributes.values}
				mode={this.state.character.attributes.mode}
				currentBonuses={this.state.character.attributes.bonuses}
				setMode={(mode: string) => { this.setState({character: {...this.state.character, attributes: {...this.state.character.attributes, mode}}}); console.log("Mode changed", mode); }}
			/>
		</div>
		);
	}
}

export default Scg;
