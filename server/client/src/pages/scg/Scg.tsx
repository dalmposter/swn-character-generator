import React, { Component } from 'react';
import { Focus, PlayerClass, Skill } from '../../types/Object.types';
import { findObjectInList, findObjectsInListById } from '../../utility/GameObjectHelpers';
import { AttributesPanel } from './panels/attributes/AttributesPanel';
import { BackgroundsPanel } from './panels/backgrounds/BackgroundsPanel';
import { ClassPanel } from './panels/class/classPanel';
import { FociPanel } from './panels/foci/fociPanel';
import { SkillsPanel } from './panels/skills/skillsPanel';
import "./scg.scss";
import { ScgProps, ScgState, defaultRules, GameObjectContext, CharacterContext, defaultCharacter, FocusPoints, FocusType, Character } from './Scg.types';

class Scg extends Component<ScgProps, ScgState>
{
	constructor(props: ScgProps)
	{
		super(props);
		this.state = {
			character: defaultCharacter,
			backgrounds: [],
			skills: [],
			systemSkills: [],
			classes: [],
			classDescriptions: [],
			foci: [],
			ruleset: defaultRules,
			canPlusFoci: "any",
		};
	}

	// Fetch data on tool load
	componentDidMount()
	{
		this.fetchBackgrounds();
		this.fetchSkills();
		this.fetchClasses();
		this.fetchClassDescriptions();
		this.fetchFoci();
	}

	// ******** Fetchers for data from the API ************//
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
		.then((skills: Skill[]) => this.setState({
				skills: skills.filter((skill: Skill) => !skill.system),
				systemSkills: skills.filter((skill: Skill) => skill.system),
			}));
	}

	fetchClasses()
	{
		fetch('api/classes')
		.then(res => res.json())
		.then((playerClasses: PlayerClass[]) => playerClasses.filter((playerClass: PlayerClass) => !playerClass.reserved))
		.then(classes => this.setState({classes}));
	}

	fetchFoci()
	{
		fetch('api/foci')
		.then(res => res.json())
		.then((foci: Focus[]) => this.setState({foci}));
	}

	fetchClassDescriptions()
	{
		fetch('api/class-descriptions')
		.then(res => res.json())
		.then(classDescriptions => this.setState({classDescriptions}));
	}

	// ************ End fetchers ***************** //
	
	removeCharacterSection(key: string)
	{
		let character = this.state.character;
		character[key] = null;
		this.setState({ character });
	}

	// ************ Resetters for character sections/panels ***************//
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

	resetClass = () =>
	{
		this.removeCharacterSection("class");
		console.log("Class reset");
	}

	resetFoci = () =>
	{
		this.removeCharacterSection("foci");
		console.log("Foci reset");
	}

	// ************ End resetters for character sections/panels ***************//

	
	// ************ Foci related functions ***************//

	addFocus = (focusId: number) =>
	{
		let character = this.state.character;
		let isCombat = findObjectInList(
				this.state.foci,
				((focus: Focus) => focus.id === focusId)
			).is_combat;
		
		if(isCombat && character.foci.availablePoints.combat > 0)
		{
			character.foci.availablePoints.combat--;
			character.foci.spentPoints.combat++;
		}
		else if(!isCombat && character.foci.availablePoints.noncombat > 0)
		{
			character.foci.availablePoints.noncombat--;
			character.foci.spentPoints.noncombat++;
		}
		else if(character.foci.availablePoints.any > 0)
		{
			character.foci.availablePoints.any--;
			character.foci.spentPoints.any++;
		}
		else
		{
			console.error("Tried to spend a focus point, but we have no appropriate points");
			return;
		}

		character.foci.chosenFoci.set(focusId,
			character.foci.chosenFoci.has(focusId)
			? character.foci.chosenFoci.get(focusId) + 1
			: 1);
		this.setState({character, canPlusFoci: this.getCanPlusFoci(character)});
	}

	getCanPlusFoci = (character: Character): FocusType =>
	{
		let canPlusFoci = null;
		if(character.foci.availablePoints.any > 0) canPlusFoci = "any";
		else if(character.foci.availablePoints.noncombat > 0)
		{
			if(character.foci.availablePoints.combat > 0) canPlusFoci = "any";
			else canPlusFoci = "noncombat"
		}
		else if(character.foci.availablePoints.combat > 0) canPlusFoci = "combat";

		return canPlusFoci;
	}

	setAvailableFociPoints = (newPoints: FocusPoints) =>
	{
		let character = this.state.character;
		character.foci.availablePoints = newPoints;

		this.setState({character, canPlusFoci: this.getCanPlusFoci(character)});
	}

	removeFocus = (focusId: number) =>
	{
		let character = this.state.character;
		let currLevel = character.foci.chosenFoci.get(focusId);
		if(currLevel === 1) character.foci.chosenFoci.delete(focusId);
		else character.foci.chosenFoci.set(focusId, currLevel-1);

		let foci: Focus[] = findObjectsInListById(
			this.state.foci, [...character.foci.chosenFoci.keys()]);

		let combatLevels = 0;
		let noncombatLevels = 0;

		foci.forEach((focus: Focus) => {
			if(focus.is_combat) combatLevels += character.foci.chosenFoci.get(focus.id);
			else noncombatLevels += character.foci.chosenFoci.get(focus.id);
		})

		// Calculate what point type to refund from removing this focus
		// It might be different to the type that was spent on it
		let workingMatrix = {...character.foci.spentPoints};
		workingMatrix.combat -= combatLevels;
		workingMatrix.noncombat -= noncombatLevels;
		if(workingMatrix.combat < 0)
		{
			workingMatrix.any += workingMatrix.combat;
			workingMatrix.combat = 0;
		}
		if(workingMatrix.noncombat < 0)
		{
			workingMatrix.any += workingMatrix.noncombat;
			workingMatrix.noncombat = 0;
		}

		["combat", "noncombat", "any"].forEach((type: string) => {
			character.foci.availablePoints[type] += workingMatrix[type];
			character.foci.spentPoints[type] -= workingMatrix[type];
		});
	
		this.setState({character, canPlusFoci: this.getCanPlusFoci(character)});
	}

	// ************ End foci related functions ***************//

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
							}}
						/>

						<BackgroundsPanel
							onReset={ this.resetBackgrounds }
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

						<ClassPanel
							onReset={ this.resetClass }
						/>
						
						<FociPanel
							canPlus={ this.state.canPlusFoci }
							onReset={ this.resetFoci }
							addFocus={ this.addFocus }
							removeFocus={ this.removeFocus }
						/>

					</CharacterContext.Provider>
				</GameObjectContext.Provider>
			</div>
		</div>
		);
	}
}

export default Scg;
