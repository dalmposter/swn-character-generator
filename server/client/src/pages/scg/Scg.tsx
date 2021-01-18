import React, { Component } from 'react';
import { Background, ClassDescription, Equipment, EquipmentPackage, Focus, PlayerClass, PsychicDiscipline, PsychicPower, Skill } from '../../types/Object.types';
import { findObjectInMap, findObjectsInMap, objectToMap } from '../../utility/GameObjectHelpers';
import AttributesPanel from './panels/attributes/AttributesPanel';
import BackgroundsPanel from './panels/backgrounds/BackgroundsPanel';
import ClassPanel from './panels/class/classPanel';
import EquipmentPanel from './panels/equipment/EquipmentPanel';
import FociPanel from './panels/foci/fociPanel';
import PsychicPowersPanel from './panels/psychicPowers/psychicPowersPanel';
import SkillsPanel from './panels/skills/skillsPanel';
import "./scg.scss";
import { ScgProps, ScgState, defaultRules, GameObjectContext, CharacterContext, defaultCharacter, FocusPoints, FocusType, Character, defaultObjectContext } from './Scg.types';

/**
 * Character creator high order component.
 * Holds all state for the tool and passes call-backs down to children
 */
class Scg extends Component<ScgProps, ScgState>
{
	constructor(props: ScgProps)
	{
		super(props);
		this.state = {
			...defaultObjectContext,
			character: defaultCharacter,
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
		this.fetchPsychics();
		this.fetchItems();
		this.fetchEquipmentPackages();
	}

	// ******** Fetchers for data from the API ************ //

	fetchBackgrounds()
	{
		fetch('/api/backgrounds')
		.then(res => res.json())
		.then(backgrounds => objectToMap<Background>(backgrounds))
		.then(backgrounds => this.setState({ backgrounds }));
	}

	fetchSkills()
	{
		fetch('/api/skills')
		.then(res => res.json())
		.then(skills => this.setState({
				skills: objectToMap<Skill>(skills["nonsystem"]),
				systemSkills: objectToMap<Skill>(skills["system"]),
			}));
	}

	fetchClasses()
	{
		fetch('api/classes')
		.then(res => res.json())
		.then(classes => this.setState({classes: {
			system: objectToMap<PlayerClass>(classes["system"]),
			nonsystem: objectToMap<PlayerClass>(classes["nonsystem"]),
		}}));
	}

	fetchFoci()
	{
		fetch('api/foci')
		.then(res => res.json())
		.then(foci => objectToMap<Focus>(foci))
		.then(foci => this.setState({foci}));
	}

	fetchClassDescriptions()
	{
		fetch('api/class-descriptions')
		.then(res => res.json())
		.then(classDescriptions => objectToMap<ClassDescription>(classDescriptions))
		.then(classDescriptions => this.setState({classDescriptions}));
	}

	/* 
	 *	Async and more complicated due to storing psychic powers within disciplines
	 * 	However, they are fetched seperately from the API
	 */
	async fetchPsychics()
	{
		await fetch('api/psychic-disciplines')
		.then(res => res.json())
		.then(psychicDisciplines => objectToMap<PsychicDiscipline>(psychicDisciplines))
		.then(psychicDisciplines => 
		{
			for(const i of psychicDisciplines.keys())
			{
				psychicDisciplines.get(i).powers = new Map();
			}
			this.setState({psychicDisciplines})
		});

		await fetch('api/psychic-powers')
		.then(res => res.json())
		.then(psychicPowers => objectToMap<PsychicPower>(psychicPowers))
		.then((psychicPowers: Map<number, PsychicPower>) => {
			const psychicDisciplines = this.state.psychicDisciplines;
			psychicPowers.forEach((psychicPower: PsychicPower, id: number) =>
			{
				psychicDisciplines.get(psychicPower.type_id).powers.has(psychicPower.level)
				? psychicDisciplines.get(psychicPower.type_id).powers.get(psychicPower.level).push(psychicPower.id)
				: psychicDisciplines.get(psychicPower.type_id).powers.set(psychicPower.level, [psychicPower.id]);
			});
			this.setState({psychicDisciplines, psychicPowers});
		});
	}

	fetchEquipmentPackages()
	{
		fetch('api/equipment-packages')
		.then(res => res.json())
		.then(equipmentPackages => objectToMap<EquipmentPackage>(equipmentPackages))
		.then(equipmentPackages => {
			this.setState({equipmentPackages});
		});
	}

	async fetchItems()
	{
		let items: any = {};
		let promises = [];

		// Trigger fetching of all types of item
		promises.push(fetch('api/armours')
		.then(res => res.json())
		.then(armours => objectToMap<Equipment>(armours))
		.then(armours => items.armours = armours));

		promises.push(fetch('api/cyberwares')
		.then(res => res.json())
		.then(cyberwares => objectToMap<Equipment>(cyberwares))
		.then(cyberwares => items.cyberwares = cyberwares));

		promises.push(fetch('api/equipments')
		.then(res => res.json())
		.then(equipments => objectToMap<Equipment>(equipments))
		.then(equipments => items.equipments = equipments));

		promises.push(fetch('api/stims')
		.then(res => res.json())
		.then(stims => objectToMap<Equipment>(stims))
		.then(stims => items.stims = stims));

		promises.push(fetch('api/weapons')
		.then(res => res.json())
		.then(weapons => objectToMap<Equipment>(weapons))
		.then(weapons => items.weapons = weapons));

		// Wait for all the fetches to complete, then save the items store to state
		await Promise.all(promises);
		this.setState({items});
	}

	// ************ End fetchers ***************** //


	// ************ Resetters for character sections/panels *************** //

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

	// ************ End resetters for character sections/panels *************** //

	
	// ************ Foci related functions *************** //

	addFocus = (focusId: number) =>
	{
		let character = this.state.character;
		let isCombat = findObjectInMap(
				focusId,
				this.state.foci
			).is_combat;
		
		// Decide how to pay for the focus
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

	/**
	 * Check what types of foci a character could level up.
	 * Takes an arbitrary character, not based on state.
	 * This is so members can update the state with this value at the same time as updating the character
	 */
	getCanPlusFoci = (character: Character): FocusType =>
	{
		let canPlusFoci = null;
		if(character.foci.availablePoints.any > 0) canPlusFoci = "any";
		else if(character.foci.availablePoints.noncombat > 0)
		{
			if(character.foci.availablePoints.combat > 0) canPlusFoci = "any";
			else canPlusFoci = "noncombat";
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

		let foci: Focus[] = findObjectsInMap(
			[...character.foci.chosenFoci.keys()],
			this.state.foci);

		// Calculate how many levels in each class of foci we have
		let combatLevels = 0;
		let noncombatLevels = 0;

		foci.forEach((focus: Focus) => {
			if(focus.is_combat) combatLevels += character.foci.chosenFoci.get(focus.id);
			else noncombatLevels += character.foci.chosenFoci.get(focus.id);
		})

		// Calculate what point type to refund from removing this focus
		// It might be different to the type that was spent on it
		// This works by starting with the points we have spent, taken from state
		let workingMatrix = {...character.foci.spentPoints};
		// The total levels in (non)combat foci are deducted from our spent (non)combat points
		workingMatrix.combat -= combatLevels;
		workingMatrix.noncombat -= noncombatLevels;
		// Then "any" points are reduced to bring (non)combat points up to 0 if needed
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

		// All remaining points from the original spentPoints object are refunded to the player
		["combat", "noncombat", "any"].forEach((type: string) => {
			character.foci.availablePoints[type] += workingMatrix[type];
			character.foci.spentPoints[type] -= workingMatrix[type];
		});
	
		this.setState({character, canPlusFoci: this.getCanPlusFoci(character)});
	}

	// ************ End foci related functions ***************//
	
	
	// ************ Psychic related functions ***************//
	
	/**
	 * Increase a discipline in level
	 */
	upDiscipline = (id: number) =>
	{
		console.log("Ran upDiscipline");
		let character = this.state.character;
		character.psychics.set(id, {
			...character.psychics.get(id),
			level: character.psychics.get(id).level + 1,
			unspentPoints: character.psychics.get(id).unspentPoints + 1,
		})
		this.setState({character});
	}

	/**
	 * Decrease a discipline in level, or remove it if level 0
	 */
	downDiscipline = (id: number) =>
	{
		let character = this.state.character;
		let currLevel = character.psychics.get(id).level;
		if(currLevel === 0)
		{
			character.psychics.delete(id);
		}
		else
		{
			character.psychics.set(id, {
				...character.psychics.get(id),
				level: currLevel - 1,
			})
		}
		this.setState({character});
	}

	addDiscipline = (id: number) => 
	{
		let character = this.state.character;
		character.psychics.set(id, { level: 0, knownSkills: [], unspentPoints: 0 });
		this.setState({character});
	}

	removeDiscipline = (id: number) =>
	{
		let character = this.state.character;
		character.psychics.delete(id);
		this.setState({character});
	}

	addPower = (typeId: number, id: number) =>
	{
		let character = this.state.character;
		character.psychics.get(typeId).knownSkills.push(id);
		this.setState({character});
	}

	removePower = (typeId: number, id: number) =>
	{
		let character = this.state.character;
		character.psychics.get(typeId).knownSkills = character.psychics.get(typeId).knownSkills.filter((skill: number) => skill !== id);
		this.setState({character});
	}

	// ************ End psychic related functions ***************//


	render()
	{
		return (
		<div className="Scg">
			<h1>SWN Character Generator</h1>
			<div id="tool">
				{ /* 
					Context providers allow their data to be accessed by any child component
					via a context consumer or similar mechanism.
					The player character and game object store is passed around like this
				*/ }
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

						<PsychicPowersPanel
							upDiscipline={ this.upDiscipline }
							downDiscipline={ this.downDiscipline }
							addDiscipline={ this.addDiscipline }
							removeDiscipline={ this.removeDiscipline }
							addPower={ this.addPower }
							removePower={ this.removePower }
						/>

						<EquipmentPanel

						/>

					</CharacterContext.Provider>
				</GameObjectContext.Provider>
			</div>
		</div>
		);
	}
}

export default Scg;
