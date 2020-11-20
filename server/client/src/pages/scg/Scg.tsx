import React, { Component } from 'react';
import { AttributesPanel } from './panels/attributes/AttributesPanel';
import { BackgroundsPanel } from './panels/backgrounds/BackgroundsPanel';
import "./scg.scss";
import { ScgProps, ScgState, defaultRules, GameObjectsContext, GameObjectContext } from './Scg.types';

class Scg extends Component<ScgProps, ScgState>
{
	constructor(props: ScgProps)
	{
		super(props);
		this.state = {
			character: {
				attributes: {
					values: new Map(Object.entries({dex: 14, str: 12, con: 10, int: 12, wis: 9, cha: 7})),
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
			backgrounds: [],
			skills: [],
		};
	}

	// Fetch data on tool load
	componentDidMount()
	{
		this.fetchBackgrounds();
		this.fetchSkills();
	}

	fetchBackgrounds()
	{
		fetch('/api/backgrounds')
		.then(res => res.json())
		.then(backgrounds => this.setState({ backgrounds }));
	}

	fetchSkills()
	{
		fetch('/api/skills')
		.then(res => res.json())
		.then(skills => this.setState({ skills }));
	}

	render()
	{
		return (
		<div className="Scg">
			<h1>SWN Character Generator</h1>
			<p>Tool goes here</p>
			<br />
			<div id="tool">
				<GameObjectContext.Provider value={{ ...this.state }} >
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
						setMode={ (mode: string) => {
							this.setState({
								character: {
									...this.state.character,
									attributes: {...this.state.character.attributes, mode}
								}
							});
							console.log("Mode changed", mode);
						}}
					/>

					<BackgroundsPanel
						fetchBackgrounds={ this.fetchBackgrounds }
					/>
				</GameObjectContext.Provider>
			</div>
		</div>
		);
	}
}

export default Scg;
