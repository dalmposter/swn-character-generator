import React, { Component } from 'react';
import { Skill } from '../../types/Object.types';
import { AttributesPanel } from './panels/attributes/AttributesPanel';
import { BackgroundsPanel } from './panels/backgrounds/BackgroundsPanel';
import { SkillsPanel } from './panels/skills/skillsPanel';
import "./scg.scss";
import { ScgProps, ScgState, defaultRules, GameObjectContext, CharacterContext } from './Scg.types';

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
				},
				background: {
					value: 0,
				},
				skills: {
					availablePoints: {
						any: 1,
						combat: 0,
						noncombat: 0,
					},
					earntSkills: new Map([
						[0, {level: 0, spentPoints: {any: 1}}],
						[3, {level: 1}],
						[16, {level: 0}]
					]),
				}
			},
			backgrounds: [],
			skills: [],
			systemSkills: [],
			ruleset: defaultRules,
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
		.then((skills: Skill[]) => {
			this.setState({
				skills: skills.filter((skill: Skill) => !skill.system),
				systemSkills: skills.filter((skill: Skill) => skill.system),
			});
		});
	}
	
	removeCharacterSection(key: string)
	{
		let character = this.state.character;
		character[key] = null;
		this.setState({ character });
	}

	resetAttributes = () =>
	{
		this.removeCharacterSection("attributes");
		console.log("Attributes reset");
	}

	resetBackgrounds = () =>
	{
		this.removeCharacterSection("background");
		console.log("Background reset");
	}

	resetSkills = () =>
	{
		this.removeCharacterSection("skills");
		console.log("Skills reset");
	}

	render()
	{
		return (
		<div className="Scg">
			<h1>SWN Character Generator</h1>
			<p>Tool goes here</p>
			<br />
			<div id="tool">
				<GameObjectContext.Provider value={{ ...this.state }}>
					<CharacterContext.Provider value={ this.state.character }>
						<AttributesPanel
							onReset={ this.resetAttributes }
							attributeRuleset={this.state.ruleset.attributes}
							saveAttributes={attributes => {
								let character = this.state.character;
								character.attributes.values = attributes;
								this.setState({ character });
							}}
							mode={this.state.character.attributes.mode}
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
							onReset={ this.resetBackgrounds }
							fetchBackgrounds={ this.fetchBackgrounds }
							currentBonuses={ this.state.character.attributes.bonuses }
							setBackground={ (backgroundId: number) => {
								let character = this.state.character;
								character.background.value = backgroundId;
								this.setState({ character });
							} }
							tableRolls={ this.state.ruleset.background.tableRolls }
						/>

						<SkillsPanel
							onReset={ this.resetSkills }
							hobbies={ this.state.ruleset.skills.hobbies }
						/>

					</CharacterContext.Provider>
				</GameObjectContext.Provider>
			</div>
		</div>
		);
	}
}

export default Scg;
