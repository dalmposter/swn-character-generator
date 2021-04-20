import React, { Component } from 'react';
import { Attribute, AttributeBonus, Background, ClassBonuses, ClassDescription, Equipment, EquipmentPackage, EquipmentPackageRaw, Focus, PlayerClass, PsychicDiscipline, PsychicPower, Skill } from '../../types/Object.types';
import { findObjectInMap, findObjectsInMap, objectToMap } from '../../utility/GameObjectHelpers';
import { Character, FocusType, FocusPoints } from './character.types';
import { defaultObjectContext, defaultCharacter, defaultRules } from './default.types';
import AttributesPanel from './panels/attributes/AttributesPanel';
import BackgroundsPanel from './panels/backgrounds/BackgroundsPanel';
import ClassPanel from './panels/class/classPanel';
import EquipmentPanel from './panels/equipment/EquipmentPanel';
import ExportingPanel from './panels/exporting/ExportingPanel';
import FociPanel from './panels/foci/fociPanel';
import PsychicPowersPanel from './panels/psychicPowers/psychicPowersPanel';
import SkillsPanel from './panels/skills/skillsPanel';
import { ScgProps, ScgState, GameObjectContext, CharacterContext, GeneralOperations, AttributeOperations, BackgroundOperations, ClassOperations, FociOperations, InventoryOperations, PsychicOperations, SkillOperations } from './Scg.types';
import "./scg.scss";
import "./rsuite.scss";

/**
 * Character creator high order component.
 * Holds all state for the tool and passes call-backs down to children
 */
class Scg extends Component<ScgProps, ScgState>
{
	constructor(props: ScgProps)
	{
		super(props);

		// ----------------- BEGIN CREATING OPERATIONS FOR MANIPULATING CHARACTER -----------------//
		// Pre-define empty objects so we can reference the functions we haven't put there yet
		let generalOperations: GeneralOperations = { };
		let attributeOperations: AttributeOperations = { };
		let backgroundOperations: BackgroundOperations = { };
		let skillOperations: SkillOperations = { };
		let classOperations: ClassOperations = { };
		let fociOperations: FociOperations = { };
		let psychicOperations: PsychicOperations = { };
		let inventoryOperations: InventoryOperations = { };

		// Functions to be run when system skills are learnt in addition to adding them to sheet
		let earnSystemSkill = new Map<number, () => void>([
			[19, () => {
				let character = this.state.character;
				character.skills.availableBonuses.combat++;
				this.setState({ character });
			}],
			[20, () => {
				let character = this.state.character;
				character.skills.availableBonuses.noncombat++;
				this.setState({ character });
			}],
			[21, () => {
				let character = this.state.character;
				character.skills.availableBonuses.psychic++;
				this.setState({ character });
			}],
			[22, () => {
				let character = this.state.character;
				character.attributes.bonuses.push({
					skill_id: 22,
					name: "+1 any stat",
					description: "Increase any 1 attribute by 1",
					type: "any",
					bonus: 1,
				})
				character.attributes.remainingBonuses.any++;
				console.log("adding 1 any");
				this.setState({ character });
			}],
			[23, () => {
				let character = this.state.character;
				character.attributes.bonuses.push({
					skill_id: 22,
					name: "+2 physical",
					description: "Distribute 2 points as you please amongst physical attributes",
					type: "physical",
					bonus: 2,
				})
				character.attributes.remainingBonuses.physical += 2;
				console.log("adding 2 physical");
				this.setState({ character });
			}],
			[24, () => {
				let character = this.state.character;
				character.attributes.bonuses.push({
					skill_id: 22,
					name: "+2 mental",
					description: "Distribute 2 points as you please amongst mental attributes",
					type: "mental",
					bonus: 2,
				})
				character.attributes.remainingBonuses.mental += 2;
				console.log("adding 2 mental");
				this.setState({ character });
			}],
			[25, () => {
				let character = this.state.character;
				character.skills.availableBonuses.any++;
				this.setState({ character });
			}],
			[26, () => {
				let character = this.state.character;
				//TODO: shoot or trade
				this.setState({ character });
			}],
			[27, () => {
				let character = this.state.character;
				//TODO: stab or shoot
				this.setState({ character });
			}],
			[28, () => {
				let character = this.state.character;
				character.foci.availablePoints.combat++;
				this.setState({ character });
			}],
			[29, () => {
				let character = this.state.character;
				character.foci.availablePoints.noncombat++;
				this.setState({ character });
			}],
			[30, () => {
				let character = this.state.character;
				character.foci.availablePoints.any++;
				this.setState({ character });
			}],
			// These system skill functions are run after the skill is added the player
			// Therefore, these need only trigger a recalculation, which will account for them
			[31, generalOperations.calculateHp],
			[32, generalOperations.calculateAc],
		]);
		// TODO: unlearn system skill
		let removeSystemSkill = new Map<number, () => void>([

		]);

		// ----- GENERAL OPERATIONS ----- //
		generalOperations.calculateHp = () => {
			let character = this.state.character;
			character.finalHp = character.rolledHp;
			if(character.class && character.class.finalClass)
			{
				if(character.class.finalClass.bonuses
					&& character.class.finalClass.bonuses.hp !== undefined)
					character.finalHp += character.class.finalClass.bonuses.hp;

				if(character.class.finalClass.level_up_bonuses
					&& character.class.finalClass.level_up_bonuses.hp !== undefined)
					character.finalHp += character.class.finalClass.level_up_bonuses.hp * character.level;
				
				if(character.class.finalClass.specific_level_bonuses
					&& character.class.finalClass.specific_level_bonuses !== undefined)
				{
					character.class.finalClass.specific_level_bonuses.forEach(bonus => {
						if(bonus.hp !== undefined)
						{
							bonus.levels.forEach(level => {
								if(character.level >= level) character.finalHp += bonus.hp;
							})
						}
					})
				}
			}
			if(character.skills.earntSkills.has(31))
				character.finalHp += character.level * 2;

			character.finalHp += attributeOperations.getModifier("con") * character.level;
			this.setState({ character });
		};
		generalOperations.rollHp = () => {
			let character = this.state.character;
			let hitDie = character.class.finalClass.hit_die.split("d").map(val => parseInt(val));
			character.rolledHp = hitDie[0] * hitDie[1];
			this.setState({character});
			generalOperations.calculateHp();
		};
		generalOperations.calculateAc = () => {
			let character = this.state.character;
			character.ac = this.state.ruleset.other.baseAC;
			if(character.skills.earntSkills.has(32))
				character.ac = 15 + Math.ceil(character.level / 2);

			character.ac += attributeOperations.getModifier("dex");
			// TODO: consider armour
			this.setState({ character });
		};
		generalOperations.calculateAttackBonus = () => {
			// TODO: attack bonus
		};

		// ----- ATTRIBUTE OPERATIONS ----- //
		attributeOperations.getModifier = (key: string) => {
			// Determine the value of the stat
			let value = 0;
			if(this.state.character.attributes.values.has(key))
				value += this.state.character.attributes.values.get(key);
			if(this.state.character.attributes.bonusValues.has(key))
				value += this.state.character.attributes.bonusValues.get(key);

			if(value === 0) return 0;

			if(this.state.ruleset.attributes.modifiers.has(value))
				return this.state.ruleset.attributes.modifiers.get(value);
			
			let modKeys = [...this.state.ruleset.attributes.modifiers.keys()];
			if(modKeys.every(modKey => value < modKey))
				return this.state.ruleset.attributes.modifiers.get(Math.min(...modKeys));
			if(modKeys.every(modKey => value > modKey))
				return this.state.ruleset.attributes.modifiers.get(Math.max(...modKeys));
			
			console.warn(`Tried to find modifier for stat ${key} but it's value is not in map. It is also not greater or smaller than every entry. Ruleset file is corrupt`);
			return 0;
		};
		attributeOperations.setStat = (key: string, newValue: number) => {
			let character = this.state.character;
			character.attributes.values.set(key, newValue);
			this.setState({ character });
			if(key === "dex") generalOperations.calculateAc();
			else if(key === "con") generalOperations.calculateHp();
		};
		attributeOperations.setMode = (mode: string) => {
			this.setState({
				character: {
					...this.state.character,
					attributes: {...this.state.character.attributes, mode}
				}
			});
		};
		attributeOperations.setBonuses = (newBonuses: AttributeBonus[]) => {
			console.log("Used setAttributeBonuses (unimplemented)", newBonuses);
		};
		attributeOperations.decrementBonusValue = (attribute: Attribute) =>
		{
			let character = this.state.character;
			// Make the decrement
			character.attributes.bonusValues.set(
				attribute.key, character.attributes.bonusValues.get(attribute.key) - 1
			);
			// Calculate points spent upgrading stats of this type
			let ofSameType = this.state.ruleset.attributes.attributes
				.filter(value => value.type === attribute.type).map(value => value.key);
			let typeSpent = 0;
			character.attributes.bonusValues.forEach((value: number, key: string) => {
				if(ofSameType.includes(key)) typeSpent += value;
			});
			// Calculate how many points of stats type the player has earned
			let typeAllowed = character.attributes.bonuses
				.filter(bonus => bonus.type === attribute.type)
				.reduce((prev, current) => prev + current.bonus, 0);

			if(typeSpent >= typeAllowed) character.attributes.remainingBonuses.any++
			else character.attributes.remainingBonuses[attribute.type]++;
			this.setState({character});
			if(attribute.key === "dex") generalOperations.calculateAc();
			else if(attribute.key === "con") generalOperations.calculateHp();
		};
		attributeOperations.incrementBonusValue = (attribute: Attribute) =>
		{
			let character = this.state.character;
			let newValue = character.attributes.bonusValues.has(attribute.key)
				? character.attributes.bonusValues.get(attribute.key) + 1
				: 1
			character.attributes.bonusValues.set(attribute.key, newValue);
			if(character.attributes.remainingBonuses[attribute.type] > 0)
				character.attributes.remainingBonuses[attribute.type]--;
			else character.attributes.remainingBonuses.any--;
			this.setState({character});
			if(attribute.key === "dex") generalOperations.calculateAc();
			else if(attribute.key === "con") generalOperations.calculateHp();
		};
		
		// ----- BACKGROUND OPERATIONS ----- //
		backgroundOperations.setBackground = (backgroundId: number) =>
		{
			let character = this.state.character;
			character.background.value = backgroundId;
			this.setState({ character });
		};
		backgroundOperations.setQuick = (usingQuickSkills: boolean) =>
		{
			let character = this.state.character;
			character.background.quick = usingQuickSkills;
			this.setState({ character });
		};
		backgroundOperations.setRolledSkillIds = (rolledSkillIds: number[]) =>
		{
			let character = this.state.character;
			character.background.rolledSkillIds = rolledSkillIds;
			this.setState({ character });
		};
		backgroundOperations.setConfirmed =
		(confirmed: boolean, quickSkillIds: number[], freeSkillId: number) =>
		{
			let character = this.state.character;
			character.background.confirmed = confirmed;
			if(confirmed)
			{
				let gainedSkillIds = [];
				if(character.background.quick) gainedSkillIds = quickSkillIds;
				else gainedSkillIds = character.background.rolledSkillIds;
				gainedSkillIds = [freeSkillId, ...gainedSkillIds];

				for(const skillId of gainedSkillIds) upSkill(skillId);
				
			}
			this.setState({ character });
		}

		// ----- SKILL OPERATIONS ----- //
		let upSkill = (skillId: number, spent: { spentBonuses?: number, spentPoints?: number } = {}) => {
			let character = this.state.character;
			if(character.skills.earntSkills.has(skillId))
			{
				let skill = character.skills.earntSkills.get(skillId);
				skill.level++;
				if(spent.spentBonuses) skill.spentBonuses += spent.spentBonuses;
				if(spent.spentPoints) skill.spentPoints += spent.spentPoints;
			}
			else
			{
				character.skills.earntSkills.set(skillId, {
					level: 0,
					spentBonuses: 0,
					spentPoints: 0,
					...spent
				});
			}
			if(earnSystemSkill.has(skillId)) earnSystemSkill.get(skillId)();
			this.setState({ character });
		};
		let downSkill = (skillId: number, refunded: { spentBonuses?: number, spentPoints?: number } = {}) => {
			let character = this.state.character;
			if(character.skills.earntSkills.has(skillId))
			{
				let skill = character.skills.earntSkills.get(skillId);
				skill.level--;
				if(refunded.spentBonuses) skill.spentBonuses -= refunded.spentBonuses;
				if(refunded.spentPoints) skill.spentPoints -= refunded.spentPoints;
				if(skill.level < 0) character.skills.earntSkills.delete(skillId);
			}
			if(removeSystemSkill.has(skillId)) removeSystemSkill.get(skillId)();
			this.setState({ character });
		};
		skillOperations.learnBonusSkill = (skillId: number) => {
			let character = this.state.character;
			let skill: Skill = findObjectInMap(skillId, this.state.skills);
			let type = skill.is_combat? "combat" : "noncombat";

			if(character.skills.availableBonuses[type] > 0)
			{
				character.skills.availableBonuses[type]--;
				character.skills.spentBonuses[type]++;
			}
			else if(character.skills.availableBonuses.any > 0)
			{
				character.skills.availableBonuses.any--;
				character.skills.spentBonuses.any++;
			}
			else return;

			// Currently can only spend bonuses since points are unsupported
			upSkill(skillId, { spentBonuses: 1 });
		};
		skillOperations.removeBonusSkill = (skillId: number) => {
			let character = this.state.character;
			let skill: Skill = findObjectInMap(skillId, this.state.skills);
			let type = skill.is_combat? "combat" : "noncombat";

			if(!character.skills.earntSkills.has(skillId)
				|| character.skills.earntSkills.get(skillId).spentBonuses <= 0) return;
			
			if(character.skills.spentBonuses.any > 0)
			{
				character.skills.spentBonuses.any--;
				character.skills.availableBonuses.any++;
			}
			else if(character.skills.spentBonuses[type] > 0)
			{
				character.skills.spentBonuses[type]--;
				character.skills.availableBonuses[type]++;
			}
			else
			{
				console.error("Tried to removeBonusSkill but no bonuses have been spent", skillId);
				return;
			}

			// Currently can only spend bonuses since points are unsupported
			downSkill(skillId, { spentBonuses: 1 });
			this.setState({ character });
		};

		// ----- CLASS OPERATIONS ----- //
		classOperations.addClassId = (classId: number) => {
			if(this.state.character.class.classIds.has(classId)) return;
			let character = this.state.character;
			if(character.class.classIds.size >= this.state.ruleset.class.multiCount)
				character.class.classIds.delete([...character.class.classIds.keys()][0]);
			character.class.classIds.add(classId);
			this.setState({ character });
		};
		classOperations.removeClassId = (classId: number) => {
			let character = this.state.character;
			character.class.classIds.delete(classId);
			this.setState({ character });
		};
		classOperations.confirmClass = () => {
			if(this.state.character.class.confirmed) return;
			let character = this.state.character;
			character.class.confirmed = true;
			let newClasses: PlayerClass[] = [];
			newClasses.push(...findObjectsInMap(
				Array.from(this.state.character.class.classIds),
				true,
				this.state.classes.nonsystem)
			);
			// Construct the characters 'true' class to store in their sheet
			// This is either the full class of the 1 class they picked
			// Or the best values from each class they chose to multi-class with
			if(newClasses.length === 1)
			{
				character.class.finalClass = newClasses[0].full_class;
			}
			// Add default class description for missing values
			else [...newClasses, findObjectInMap(1, this.state.classes.system)]
			.map((newClass: PlayerClass) => newClass.partial_class)
			.forEach(newClass =>
			{
				const addBonusesToClass = (bonuses: ClassBonuses, typeKey: string) => {
					if(!character.class.finalClass) character.class.finalClass = {
						id: -1,
						name: "",
						source_id: -1,
						page: -1,
					};
					if(!character.class.finalClass[typeKey]) character.class.finalClass[typeKey] = bonuses;
					else
					{
						if(bonuses.skills)
						{
							if(character.class.finalClass[typeKey].skills)
								character.class.finalClass[typeKey].skills.push(...bonuses.skills);
							else character.class.finalClass[typeKey].skills = [...bonuses.skills];
						}
						if(bonuses.attack_bonus)
						{
							if(!character.class.finalClass[typeKey].attack_bonus
							|| bonuses.attack_bonus > character.class.finalClass[typeKey].attack_bonus)
								character.class.finalClass[typeKey].attack_bonus = bonuses.attack_bonus;
						}
						if(!character.class.finalClass[typeKey].hp)
							character.class.finalClass[typeKey].hp = bonuses.hp;
						else if(bonuses.hp > character.class.finalClass[typeKey].hp)
							character.class.finalClass[typeKey].hp += bonuses.hp;
					}
				}

				if(newClass.hit_die)
				{
					if(!character.class.finalClass.hit_die)
						character.class.finalClass.hit_die = newClass.hit_die;
					else
					{
						let hitDie = newClass.hit_die.split("d").map(val => parseInt(val));
						let currentDie = character.class.finalClass.hit_die.split("d").map(val => parseInt(val));
						if(hitDie[0] * hitDie[1] > currentDie[0] * currentDie[1])
							character.class.finalClass.hit_die = newClass.hit_die;
					}
				}
				["bonuses", "level_up_bonuses"].forEach(typeKey =>
				{
					if(newClass[typeKey]) addBonusesToClass(newClass[typeKey], typeKey)
				});
				if(newClass.specific_level_bonuses)
				{
					if(character.class.finalClass.specific_level_bonuses)
						character.class.finalClass.specific_level_bonuses.push(...newClass.specific_level_bonuses);
					else character.class.finalClass.specific_level_bonuses = newClass.specific_level_bonuses;
				}
				if(newClass.ability_descriptions)
				{
					if(!character.class.finalClass.ability_descriptions)
						character.class.finalClass.ability_descriptions = [...newClass.ability_descriptions];
					else character.class.finalClass.ability_descriptions.push(...newClass.ability_descriptions);
				}
				character.class.finalClass.is_psychic = character.class.finalClass.is_psychic || newClass.is_psychic;
			});

			const applyBonuses = (bonuses: ClassBonuses, multiplier: number = 1) => {
				if(bonuses === undefined) return;
				if(bonuses.attack_bonus)
					character.attackBonus += bonuses.attack_bonus * multiplier;
				if(bonuses.skills)
					bonuses.skills.map(skill => upSkill(skill));
			}

			applyBonuses(character.class.finalClass.bonuses);
			applyBonuses(character.class.finalClass.level_up_bonuses, character.level);
			if(character.class.finalClass.specific_level_bonuses)
			{
				character.class.finalClass.specific_level_bonuses.forEach(levelBonus =>
				applyBonuses(levelBonus,
					// Construct array from range 1...character.level
					[...Array(character.level).keys()].map(x => x+1).filter(
					// Filter it to contain those levels that apply to this bonus
					// (And that the player is at or passed)
					level => levelBonus.levels
						.includes(level)
					// Take it's length, this is the number of times the player should receive these bonuses
					).length
				)
				)
			}

			this.setState({ character });
			generalOperations.rollHp();
		};
		classOperations.resetClass = () => {

		};
		
		// ----- FOCI OPERATIONS ----- //
		/**
		* Check what types of foci a character could level up.
		* Takes an arbitrary character, not based on state.
		* This is so members can update the state with this value at the same time as updating the character
		*/
		fociOperations.getCanPlusFoci = (character: Character = undefined): FocusType =>
		{
			if(character === undefined) character = this.state.character;
			let canPlusFoci = null;
			if(character.foci.availablePoints.any > 0) canPlusFoci = "any";
			else if(character.foci.availablePoints.noncombat > 0)
			{
				if(character.foci.availablePoints.combat > 0) canPlusFoci = "any";
				else canPlusFoci = "noncombat";
			}
			else if(character.foci.availablePoints.combat > 0) canPlusFoci = "combat";

			return canPlusFoci;
		};
		fociOperations.addFocus = (focusId: number) =>
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

			if(character.foci.chosenFoci.has(focusId))
				character.foci.chosenFoci.set(focusId, character.foci.chosenFoci.get(focusId) + 1);
			else
			{
				character.foci.chosenFoci.set(focusId, 1);
				upSkill(this.state.foci.get(focusId).level_1_skill_id);
			}
			this.setState({character, canPlusFoci: fociOperations.getCanPlusFoci(character)});
		};
		fociOperations.setAvailableFociPoints = (newPoints: FocusPoints) =>
		{
			let character = this.state.character;
			character.foci.availablePoints = newPoints;

			this.setState({character, canPlusFoci: fociOperations.getCanPlusFoci(character)});
		};
		fociOperations.removeFocus = (focusId: number) =>
		{
			let character = this.state.character;
			let currLevel = character.foci.chosenFoci.get(focusId);
			if(currLevel === 1)
			{
				character.foci.chosenFoci.delete(focusId);
				downSkill(this.state.foci.get(focusId).level_1_skill_id);
			}
			else character.foci.chosenFoci.set(focusId, currLevel-1);

			let foci: Focus[] = findObjectsInMap(
				[...character.foci.chosenFoci.keys()],
				true,
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
			this.setState({character, canPlusFoci: fociOperations.getCanPlusFoci(character)});
		};

		// ----- PSYCHIC OPERATIONS ----- //
		psychicOperations.removePower = (typeId: number, id: number, forceRefundTechnique = false, forceRefundAny = false) =>
		{
				let character = this.state.character;
				let thisDiscipline = character.psychics.get(typeId);
				// Remove the power from the character
				if(thisDiscipline.knownTechniques.includes(id))
					thisDiscipline.knownTechniques = thisDiscipline.knownTechniques.filter((skill: number) => skill !== id);
				else return;

				// Calculate how to refund the player
				// Find level of removed power, l
				let l = this.state.psychicPowers.get(id).level;
				// Find number of other powers the player owns of level <= l, o
				let o = thisDiscipline.knownTechniques
					.filter(skillId => this.state.psychicPowers.get(skillId).level <= l).length;
				// If o >= l and number of known skills >= discipline level, refund 1 any bonus skill
				if(forceRefundAny || (!forceRefundTechnique && o >= l
					&& thisDiscipline.knownTechniques.length + thisDiscipline.freePicks >= thisDiscipline.level)
				)
				{
					character.skills.availableBonuses.any++;
					character.skills.spentBonuses.any--;
					character.skills.anySpentOnPsychics--;
				}
				// Otherwise refund 1 free pick
				else thisDiscipline.freePicks++;
				// TODO: refund skill points (not implemented)

				this.setState({character});
				return character;
		};
		psychicOperations.downDiscipline = (disciplineId: number) =>
		{
			let character = this.state.character;
			let currLevel = character.psychics.get(disciplineId).level;
			let disciplineObject = this.state.psychicDisciplines.get(disciplineId);
			// Decrease the level of the discipline (or unlearn it if level 0)
			if(currLevel === 0)
			{
				character.psychics.delete(disciplineId);
			}
			else
			{
				// Unlearn all learnt techniques in the current level of the discipline
				let doomedTechniques = disciplineObject.powers.get(currLevel);
				doomedTechniques = doomedTechniques.filter(techId =>
					character.psychics.get(disciplineId).knownTechniques.includes(techId));
				// If any techniques are being removed this way, force one of them to refund a technique pick
				// The player will then lose this pick from the discipline level being decreased
				if(doomedTechniques.length > 0)
					psychicOperations.removePower(disciplineId, doomedTechniques.pop(), true);
				// Force the rest not to refund technique picks since necessarily none were spent on them
				// The player can only have earned one free pick since being able to earn techniques of this level
				doomedTechniques.forEach(techniqueId =>
					psychicOperations.removePower(disciplineId, techniqueId, false, true))
				
				/* 	
				If we have spent exactly all our free picks, even after unlearning the above,
				We will need to unlearn another so as to not result in a negative amount of remaining picks
				Sort known skills in descending order of level.
				We can unlearn from the front of the array if needed
				*/
				character.psychics.get(disciplineId).knownTechniques.sort((a, b) =>
					this.state.psychicPowers.get(b).level - this.state.psychicPowers.get(a).level);
				
				console.log("free picks", character.psychics.get(disciplineId).freePicks);
				// Unlearn skills until we have a positive number of free picks (we lost one just now)
				for(let i = character.psychics.get(disciplineId).freePicks - 1; i < 0; i++)
				{
					if(character.psychics.get(disciplineId).knownTechniques.length === 0)
					{
						console.error(`Tried to unlearn a technique in preperation for reducing level of psychic discipline ${disciplineId}, but there were none`);
						break;
					}
					psychicOperations.removePower(disciplineId, character.psychics.get(disciplineId).knownTechniques[0]);
				}

				// Reduce the current level of discipline by 1
				character.psychics.set(disciplineId, {
					...character.psychics.get(disciplineId),
					level: currLevel - 1,
					freePicks: character.psychics.get(disciplineId).freePicks - 1,
				})
			}
			// Refund spent points
			if(character.skills.anySpentOnPsychics > 0)
			{
				character.skills.availableBonuses.any++;
				character.skills.spentBonuses.any--;
				character.skills.anySpentOnPsychics--;
			}
			else if(character.skills.spentBonuses.psychic > 0)
			{
				character.skills.availableBonuses.psychic++;
				character.skills.spentBonuses.psychic--;
			}
			// TODO: refund skill points once they are functional
			else
			{
				console.error("Tried to refund points for discipline", disciplineId, "but none were spent");
			}
			this.setState({character});
		};
		psychicOperations.upDiscipline = (id: number) =>
		{
			let character = this.state.character;
			// Pay for the discipline
			if(character.skills.availableBonuses.psychic > 0)
			{
				character.skills.availableBonuses.psychic--;
				character.skills.spentBonuses.psychic++;
			}
			else if(character.skills.availableBonuses.any > 0)
			{
				character.skills.availableBonuses.any--;
				character.skills.spentBonuses.any++;
				character.skills.anySpentOnPsychics++;
			}
			else 
			{
				// We should be guaranteed to afford the discipline, enforced by inputs
				// So just silently fail if this happens. Don't corrupt the character, don't crash
				console.error("Tried to learn discipline", id, "but couldn't afford it");
				return;
			}
			// Level up the discipline (or learn it if not exists)
			if(character.psychics.has(id))
			{
				character.psychics.set(id, {
					...character.psychics.get(id),
					level: character.psychics.get(id).level + 1,
					freePicks: character.psychics.get(id).freePicks + 1,
				})
			}
			else
			{
				character.psychics.set(id,
					{ level: 0, knownTechniques: [], freePicks: 0 }
				);
			}
			this.setState({character});
		};
		psychicOperations.removeDiscipline = (id: number) =>
		{
			// Simply repeatedly reduce the discipline level until it is gone.
			// Reducing the level already handles the logic at every level
			while(this.state.character.psychics.has(id)) psychicOperations.downDiscipline(id);
		};
		psychicOperations.addPower = (typeId: number, id: number) =>
		{
			let character = this.state.character;
			let psychic = character.psychics.get(typeId);
			if(psychic.freePicks > 0) psychic.freePicks--;
			else if(character.skills.availableBonuses.any > 0)
			{
				character.skills.availableBonuses.any--;
				character.skills.spentBonuses.any++;
				character.skills.anySpentOnPsychics++;
			}
			else
			{
				console.error(`Tried to learn psychic power with id ${id} but had no points to learn it with`);
				return;
			}
			character.psychics.get(typeId).knownTechniques.push(id);
			this.setState({character});
		};

		// ----- INVENTORY OPERATIONS ----- //
		inventoryOperations.addItem = (id: number, type: string, amount: number = 1) =>
		{
			let character = this.state.character;
			if(character.inventory[type] === undefined) character.inventory[type] = new Map();
			if(character.inventory[type].has(id))
			{
				character.inventory[type].set(id, amount + character.inventory[type].get(id));
			}
			else character.inventory[type].set(id, amount);
			this.setState({character});
		}
		inventoryOperations.removeItem = (id: number, type: string, amount: number = 1) =>
		{
			let character = this.state.character;
			if(type === "*")
			{
				for(let inventoryStore in this.state.items)
				{
					if(this.state.items[inventoryStore].has(id))
					{
						type = inventoryStore;
						break;
					}
				}
			}
			if(character.inventory[type].has(id))
			{
				let newAmount = character.inventory[type].get(id) - amount;
				if(newAmount > 0) character.inventory[type].set(id, newAmount);
				else character.inventory[type].delete(id);
			}
			else
			{
				console.error(`Tried to remove item ${id} but was not present`);
				return;
			}
			this.setState({character});
		}
		inventoryOperations.addCredits = (amount: number) =>
		{
			let character = this.state.character;
			character.inventory.credits += amount;
			if(character.inventory.credits < 0) console.error("Player credits below 0");
			this.setState({character});
		}

		this.state = {
			...defaultObjectContext,
			character: {
				...defaultCharacter,
			},
			// Store character functions in state so we can pass them easily to the components
			// Via the CharacterContext provider. No need to pass callbacks as props
			operations: {
				general: generalOperations,
				attributes: attributeOperations,
				backgrounds: backgroundOperations,
				skills: skillOperations,
				classes: classOperations,
				foci: fociOperations,
				psychics: psychicOperations,
				inventory: inventoryOperations,
			},
			ruleset: defaultRules,
			canPlusFoci: "any",
		};
		// Enable hobby selection via any points equal to number of hobbies
		this.state.character.skills.availableBonuses.any = this.state.ruleset.skills.hobbies;
		this.state.character.foci.availablePoints.any = this.state.ruleset.foci.initialCount;
	}

	// Fetch data on tool load
	componentDidMount()
	{
		this.fetchBackgrounds();
		this.fetchSkills();
		this.fetchClasses();
		this.fetchFoci();
		this.fetchPsychics();
		this.fetchItems();
		this.fetchEquipmentPackages();

		this.setState({ canPlusFoci: this.state.operations.foci.getCanPlusFoci(this.state.character) })
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
		.then(async classes =>
		{
			let descs: Map<number, ClassDescription>;
			await fetch('api/class-descriptions')
				.then(res => res.json())
				.then(classDescriptions => descs = objectToMap<ClassDescription>(classDescriptions)
			);

			let system = objectToMap<PlayerClass>(classes["system"]);
			let nonsystem = objectToMap<PlayerClass>(classes["nonsystem"]);

			const descCombiner = value => {
				value.partial_class = descs.get(value.partial_class_id);
				value.full_class = descs.get(value.full_class_id);
			}

			system.forEach(descCombiner);
			nonsystem.forEach(descCombiner);

			this.setState({classes: {
				system: objectToMap<PlayerClass>(classes["system"]),
				nonsystem: objectToMap<PlayerClass>(classes["nonsystem"]),
			}});
		});
	}

	fetchFoci()
	{
		fetch('api/foci')
		.then(res => res.json())
		.then(foci => objectToMap<Focus>(foci))
		.then(foci => this.setState({foci}));
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
		// Insert short_description field into every power
		// Created from first 3 sentences of full description
		.then((psychicPowers: Map<number, PsychicPower>) =>
			new Map([...psychicPowers.entries()].map(value => [value[0],
				{...value[1],
					short_description: value[1].description.split(".").slice(0, 3).join(".") + "."
				}
			]))
		)
		// Insert IDs of powers into their appropriate discipline's power level maps
		// Makes it much easier to create tree of psychic skills
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
		.then(equipmentPackagesRaw => new Map(
			// Loop through all the packs, we need to convert it from json to storage format
			Object.entries(equipmentPackagesRaw).map(([packId, packRaw]: [string, EquipmentPackageRaw]) =>
			{
				let packOut: EquipmentPackage = {...packRaw, contents: { }};
				// Loop through each contents section (e.g. armours) of the packs
				Object.entries(packRaw.contents).forEach(([section, contents]: [string, { [_: string]: number }]) =>
				{
					// Convert the section from an object indexed with strings (json), to a map indexed with numbers
					packOut.contents[section] = objectToMap<number>(contents);
				})
				return [parseInt(packId), packOut];
			}
		)))
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

	removeCharacterSection = (key: string) =>
	{
		let character = this.state.character;
		character[key] = null;
		this.setState({ character });
	}

	resetAttributes = () =>
	{
		let character = this.state.character;
		character.attributes.values.clear();
		character.attributes.bonusValues.clear();
		// Sum up the bonuses giving stats to each type and store in remainingBonuses
		["any", "physical", "mental"].forEach((key) => 
			character.attributes.remainingBonuses[key] =
				character.attributes.bonuses
					.filter(bonus => bonus.type === key)
					.map(bonus => bonus.bonus)
					.reduce((prev, curr) => prev + curr, 0)
		);
		this.setState({ character });
		console.log("Attributes reset");
	};

	resetBackgrounds = () =>
	{
		this.removeCharacterSection("background");
		console.log("Background reset");
	};

	resetSkills = () =>
	{
		this.removeCharacterSection("skills");
		console.log("Skills reset");
	};

	resetClass = () =>
	{
		this.removeCharacterSection("class");
		console.log("Class reset");
	};

	resetFoci = () =>
	{
		this.removeCharacterSection("foci");
		console.log("Foci reset");
	};

	// ************ End resetters for character sections/panels *************** //

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
				<GameObjectContext.Provider value={this.state}>
					<CharacterContext.Provider value={ this.state }>
            			<div className="Attributes Panel">
							<div className="flexbox">
								<h2 className="flex grow">
									{`Level: ${this.state.character.level}`}
								</h2>
								<h2 className="flex grow">
									{`HP: ${this.state.character.finalHp}`}
								</h2>
								<h2 className="flex grow">
									{`Attack Bonus: ${Math.floor(this.state.character.attackBonus)}`}
								</h2>
								<h2 className="flex grow">
									{`AC: ${this.state.character.ac}`}
								</h2>
							</div>
						</div>
						<AttributesPanel
							onReset={ this.resetAttributes }
							attributeRuleset={this.state.ruleset.attributes}
							defaultMode={ this.state.character.attributes.mode }
							modifiers={ this.state.ruleset.attributes.modifiers }
						/>

						<BackgroundsPanel
							onReset={ this.resetBackgrounds }
							tableRolls={ this.state.ruleset.background.tableRolls }
						/>

						<SkillsPanel
							onReset={ this.resetSkills }
						/>

						<ClassPanel
							onReset={ this.resetClass }
						/>
						
						<FociPanel
							canPlus={ this.state.canPlusFoci }
							onReset={ this.resetFoci }
						/>

						<PsychicPowersPanel

						/>

						<EquipmentPanel

						/>

						<ExportingPanel

						/>

					</CharacterContext.Provider>
				</GameObjectContext.Provider>
			</div>
		</div>
		);
	}
}

export default Scg;
