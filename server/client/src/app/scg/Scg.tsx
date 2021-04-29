import React, { Component } from 'react';
import { Attribute, AttributeBonus, Background, ClassBonuses, ClassDescription, Equipment, EquipmentPackage,
	EquipmentPackageRaw, Focus, PlayerClass, PsychicDiscipline, PsychicPower, Skill } from '../../types/object.types';
import { findObjectInMap, findObjectsInMap, objectToMap } from '../../utility/GameObjectHelpers';
import { Character, FocusType, FocusPoints, CharacterExport } from '../../types/character.types';
import { defaultObjectContext, defaultCharacter, defaultRuleset } from '../../types/default.types';
import { ScgProps, ScgState, GameObjectContext, CharacterContext, GeneralOperations, AttributeOperations,
	BackgroundOperations, ClassOperations, FociOperations, InventoryOperations, PsychicOperations,
	SkillOperations, MetaOperations, FormMapMaker } from './Scg.types';
import { Button, ButtonGroup, Modal, Steps } from 'rsuite';
import { TypeAttributes } from 'rsuite/lib/@types/common';
import { arrayReducer, replacer, reviver } from '../../utility/JavascriptObjectHelpers';
import { download } from '../../utility/FsUtil';
import { FileType } from 'rsuite/lib/Uploader';
import _ from "lodash";
import {  PDFDocument, PDFField, PDFTextField } from 'pdf-lib';
import { AttributeMode } from '../../types/ruleset.types';
import AttributesPanel from './panels/attributes/AttributesPanel';
import BackgroundsPanel from './panels/backgrounds/BackgroundsPanel';
import ClassPanel from './panels/class/classPanel';
import EquipmentPanel from './panels/equipment/EquipmentPanel';
import ExportingPanel from './panels/exporting/ExportingPanel';
import FociPanel from './panels/foci/fociPanel';
import IntroPanel from './panels/intro/IntroPanel';
import PsychicPowersPanel from './panels/psychicPowers/psychicPowersPanel';
import SkillsPanel from './panels/skills/skillsPanel';

import "./rsuite.scss";
import "./panels/panels.scss";
import "./scg.scss";
import GeneralPanel from './panels/general/GeneralPanel';

/**
 * Character creator high order component.
 * Holds all state for the tool and passes everything to children with context
 * Contains the character object and the functions for altering it
 */
class Scg extends Component<ScgProps, ScgState>
{
	constructor(props: ScgProps)
	{
		super(props);

		// ----------------- BEGIN CREATING OPERATIONS FOR MANIPULATING CHARACTER -----------------//
		// Pre-define empty objects so we can reference the functions we haven't put there yet
		const generalOperations: 		GeneralOperations 		= 	{ };
		const attributeOperations: 		AttributeOperations 	= 	{ };
		const backgroundOperations: 	BackgroundOperations 	= 	{ };
		const skillOperations: 			SkillOperations 		= 	{ };
		const classOperations: 			ClassOperations 		= 	{ };
		const fociOperations: 			FociOperations 			= 	{ };
		const psychicOperations: 		PsychicOperations 		= 	{ };
		const inventoryOperations: 		InventoryOperations 	= 	{ };
		const metaOperations: 			MetaOperations 			= 	{ };

		// ----- GENERAL OPERATIONS ----- //
		// Calculate and set the final HP of the character
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
		// Calculate and set the hp gained purely from leveling up via the hit die
		generalOperations.rollHp = () => {
			let character = this.state.character;
			let hitDie = character.class.finalClass.hit_die.split("d").map(val => parseInt(val));
			character.rolledHp = hitDie[0] * hitDie[1];
			this.setState({character});
			generalOperations.calculateHp();
		};
		// Calculate and set the final (unarmoured) armour class for the player
		generalOperations.calculateAc = () => {
			let character = this.state.character;
			character.ac = this.state.ruleset.general.baseAC;
			if(character.skills.earntSkills.has(32))
				character.ac = 15 + Math.ceil(character.level / 2);

			character.ac += attributeOperations.getModifier("dex");
			this.setState({ character });
		};
		// Calculate and set the finall attack bonus for the character (non-specific to weapon)
		generalOperations.calculateAttackBonus = () => {
			let character = this.state.character;
			character.attackBonus = this.state.ruleset.general.baseAttackBonus;
			if(character.class.finalClass)
			{
				if(character.class.finalClass.bonuses.attack_bonus)
					character.attackBonus += character.class.finalClass.bonuses.attack_bonus;
				if(character.class.finalClass.level_up_bonuses.attack_bonus)
					character.attackBonus += character.class.finalClass.level_up_bonuses.attack_bonus * character.level;
				if(character.class.finalClass.specific_level_bonuses)
				{
					character.class.finalClass.specific_level_bonuses.forEach(bonuses => {
						bonuses.levels.forEach(bonusLevel => {
							if(character.level >= bonusLevel)
								character.attackBonus += bonuses.attack_bonus;
						});
					});
				}
			}
			this.setState({ character });
		};
		// Calculate and set the saves of the character
		// (the number they have to beat when rolling to save themselves from harmful effects)
		generalOperations.calculateSaves = () => {
			let character = this.state.character;
			// Calculate the roll required to succeed a save. Lower is better
			// Initialise them with the common value, base (ruleset) - level
			character.saves.physical = this.state.ruleset.general.baseSave - character.level;
			character.saves.evasion = this.state.ruleset.general.baseSave - character.level;
			character.saves.mental = this.state.ruleset.general.baseSave - character.level;

			// Subtract the largest appropriate modifier
			character.saves.physical -= Math.max(...["str", "con"].map(attributeOperations.getModifier));
			character.saves.evasion -= Math.max(...["dex", "int"].map(attributeOperations.getModifier));
			character.saves.mental -= Math.max(...["wis", "cha"].map(attributeOperations.getModifier));

			this.setState({ character });
		};
		// Call all the calculate and save functions e.g. when a character file is loaded
		generalOperations.recaulculate = () => {
			generalOperations.calculateAc();
			generalOperations.calculateAttackBonus();
			generalOperations.calculateHp();
			generalOperations.calculateSaves();
			attributeOperations.calculateFinalValues();
		}
		// Perform a level up on the character. They gain certain benefits depending on the rules and their class
		generalOperations.levelUp = () => {
			let character = this.state.character;
			character.level++;
			const learnSkills = (bonuses: ClassBonuses) => {
				if(bonuses && bonuses.skills) bonuses.skills.map(skill => skillOperations.upSkill(skill));
			}
			learnSkills(character.class.finalClass.level_up_bonuses);
			character.class.finalClass.specific_level_bonuses.forEach(levelBonuses => {
				if(levelBonuses.levels.includes(character.level)) learnSkills(levelBonuses);
			})
			this.setState({ character });
			generalOperations.recaulculate();
		}
		// Set the name of the character
		generalOperations.setName = (newName: string) =>
		{
			let character = this.state.character;
			character.name = newName;
			this.setState({character});
		}
		generalOperations.setPlayerName = (newName: string) =>
		{
			let character = this.state.character;
			character.playerName = newName;
			this.setState({character});
		}

		// ----- ATTRIBUTE OPERATIONS ----- //
		attributeOperations.calculateFinalValues = () => {
			let character = this.state.character;
			this.state.ruleset.attributes.attributes.forEach((attribute: Attribute) =>
			{
				let value = 0;
				if(this.state.character.attributes.rolledValues.has(attribute.key))
					value += this.state.character.attributes.rolledValues.get(attribute.key);
				if(this.state.character.attributes.bonusValues.has(attribute.key))
					value += this.state.character.attributes.bonusValues.get(attribute.key);
				character.attributes.finalValues.set(
					attribute.key, value
				);
			})
		}
		attributeOperations.getModifier = (key: string) => {
			// TODO: maybe need to recalculate the final values here to be safe?
			// Determine the value of the stat
			let value = this.state.character.attributes.finalValues.get(key);
			if(value === 0) return 0;

			if(this.state.ruleset.attributes.modifiers.has(value))
				return this.state.ruleset.attributes.modifiers.get(value);
			
			let modKeys = [...this.state.ruleset.attributes.modifiers.keys()];
			if(modKeys.every(modKey => value < modKey))
				return this.state.ruleset.attributes.modifiers.get(Math.min(...modKeys));
			if(modKeys.every(modKey => value > modKey))
				return this.state.ruleset.attributes.modifiers.get(Math.max(...modKeys));
			
			console.warn(`Tried to find modifier for stat ${key} but it's value is not in map. It is also not greater or smaller than every entry. Ruleset or character file is corrupt`);
			return 0;
		};
		attributeOperations.setStat = (key: string, newValue: number) => {
			let character = this.state.character;
			character.attributes.rolledValues.set(key, newValue);
			character.attributes.finalValues.set(key, newValue + character.attributes.bonusValues.get(key));
			this.setState({ character });
			if(key === "dex") generalOperations.calculateAc();
			else if(key === "con") generalOperations.calculateHp();
			generalOperations.calculateSaves();
		};
		attributeOperations.setMode = (mode: AttributeMode) => {
			let character = this.state.character;
			character.attributes.mode = mode;
			this.setState({ character });
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
			character.attributes.finalValues.set(
				attribute.key, character.attributes.finalValues.get(attribute.key) - 1
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
			character.attributes.finalValues.set(
				attribute.key, character.attributes.finalValues.get(attribute.key) + 1
			);
			character.attributes.bonusValues.set(attribute.key, newValue);
			if(character.attributes.remainingBonuses[attribute.type] > 0)
				character.attributes.remainingBonuses[attribute.type]--;
			else character.attributes.remainingBonuses.any--;
			this.setState({character});
			if(attribute.key === "dex") generalOperations.calculateAc();
			else if(attribute.key === "con") generalOperations.calculateHp();
		};
		// Reset character attributes. Simply unspends every bonus and resets the rolled attributes
		attributeOperations.resetAttributes = () =>
		{
			let character = this.state.character;
			// Reset the rolled values
			character.attributes.rolledValues = new Map(defaultCharacter.attributes.rolledValues);
			this.setState({ character });

			// Keep reducing any bonus attribute values until they are 0
			this.state.ruleset.attributes.attributes.forEach((attribute: Attribute) =>
			{
				let bonusValue = character.attributes.bonusValues.get(attribute.key);
				for(let i = 0; i < bonusValue; i++)
				{
					this.state.operations.attributes.decrementBonusValue(attribute);
				}
			})
			// Recalculate the final values for displaying and exporting
			this.state.operations.attributes.calculateFinalValues();

			console.log("Attributes reset");
		};
		
		// ----- BACKGROUND OPERATIONS ----- //
		backgroundOperations.setBackground = (backgroundId: number) =>
		{
			let character = this.state.character;
			character.background.id = backgroundId;
			character.background.name = findObjectInMap(backgroundId, this.state.backgrounds).name;
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

				for(const skillId of gainedSkillIds) skillOperations.upSkill(skillId);
				
			}
			this.setState({ character });
		}
		// TODO: unlearn all skills gained from background then unconfirm the background choice
		backgroundOperations.resetBackgrounds = () =>
		{
			this.removeCharacterSection("background");
			console.log("Background reset");
		};

		// ----- SKILL OPERATIONS ----- //
		skillOperations.upSkill = (skillId: number, spent: { spentBonuses?: number, spentPoints?: number, skill?: number } = {}) => {
			let character = this.state.character;
			// Insert a default entry if there is none present
			if(!character.skills.earntSkills.has(skillId))
			{
				character.skills.earntSkills.set(skillId, {
					level: -1,
					skillSources: [],
					spentBonuses: 0,
					spentPoints: 0,
				});
			}
			let skill = character.skills.earntSkills.get(skillId);
			skill.level++;
			if(spent.spentBonuses) skill.spentBonuses += spent.spentBonuses;
			if(spent.spentPoints) skill.spentPoints += spent.spentPoints;
			if(spent.skill) skill.skillSources.push(spent.skill);

			if(this.earnSystemSkill.has(skillId)) this.earnSystemSkill.get(skillId)();
			this.setState({ character });
		};
		skillOperations.downSkill = (skillId: number, refunded: { spentBonuses?: number, spentPoints?: number } = {}) => {
			let character = this.state.character;
			if(character.skills.earntSkills.has(skillId))
			{
				let skill = character.skills.earntSkills.get(skillId);
				skill.level--;
				if(refunded.spentBonuses) skill.spentBonuses -= refunded.spentBonuses;
				if(refunded.spentPoints) skill.spentPoints -= refunded.spentPoints;
				if(skill.level < 0) character.skills.earntSkills.delete(skillId);
			}
			if(this.removeSystemSkill.has(skillId)) this.removeSystemSkill.get(skillId)();
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
			skillOperations.upSkill(skillId, { spentBonuses: 1 });
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
			skillOperations.downSkill(skillId, { spentBonuses: 1 });
			this.setState({ character });
		};
		// TODO: unspend every choice the user has made in skills
		skillOperations.resetSkills = () =>
		{
			this.removeCharacterSection("skills");
			console.log("Skills reset");
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
			else
			{
				if(!character.class.finalClass) character.class.finalClass = {
					id: -1,
					name: "",
					source_id: -1,
					page: -1,
				};
				character.class.finalClass.name = newClasses.map(clazz => clazz.name).join("-");

				const addBonusesToClass = (bonuses: ClassBonuses, typeKey: string) => {
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

				// Add default class description for missing values
				[...newClasses, findObjectInMap(1, this.state.classes.system)]
				.map((newClass: PlayerClass) => newClass.partial_class)
				.forEach(newClass =>
				{
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
			}

			const learnSkills = (bonuses: ClassBonuses) => {
				if(bonuses && bonuses.skills) bonuses.skills.map(skill => skillOperations.upSkill(skill));
			}

			// Apply base bonuses
			learnSkills(character.class.finalClass.bonuses);
			// Apply per level bonuses for each level the character has
			for(let i = 0; i < character.level; i++)
			{
				learnSkills(character.class.finalClass.level_up_bonuses);
			}
			// Apply specific level bonuses, if the character is at or past the required level
			if(character.class.finalClass.specific_level_bonuses)
			{
				character.class.finalClass.specific_level_bonuses.forEach(levelBonuses =>
					levelBonuses.levels.forEach(level => {
						if(level <= character.level) learnSkills(levelBonuses)
					})
				)
			}

			this.setState({ character });
			generalOperations.rollHp();
			generalOperations.calculateAttackBonus();
			fociOperations.calculateCanPlus();
		};
		// TODO: delete final class from character, remove all bonuses gained from that class
		classOperations.resetClass = () =>
		{
			this.removeCharacterSection("class");
			console.log("Class reset");
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
		fociOperations.calculateCanPlus = () =>
		{
			let character = this.state.character;
			character.foci.canPlus = fociOperations.getCanPlusFoci(character);
			this.setState({ character });
		}
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
				skillOperations.upSkill(this.state.foci.get(focusId).level_1_skill_id);
			}
			character.foci.canPlus = fociOperations.getCanPlusFoci(character);
			this.setState({character});
		};
		fociOperations.setAvailableFociPoints = (newPoints: FocusPoints) =>
		{
			let character = this.state.character;
			character.foci.availablePoints = newPoints;
			character.foci.canPlus = fociOperations.getCanPlusFoci(character);
			this.setState({character});
		};
		fociOperations.removeFocus = (focusId: number) =>
		{
			let character = this.state.character;
			let currLevel = character.foci.chosenFoci.get(focusId);
			if(currLevel === 1)
			{
				character.foci.chosenFoci.delete(focusId);
				skillOperations.downSkill(this.state.foci.get(focusId).level_1_skill_id);
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
			character.foci.canPlus = fociOperations.getCanPlusFoci(character);
			this.setState({character});
		};
		// TODO: unspend all foci bonuses
		fociOperations.resetFoci = () =>
		{
			this.removeCharacterSection("foci");
			console.log("Foci reset");
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
			if(character.inventory[type] === undefined) character.inventory[type] = new Map();
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
		inventoryOperations.setPack = (id: number) =>
		{
			let character = this.state.character;

			// Remove the current pack if there is one
			if(character.inventory.equipmentPackageId !== undefined
				&& this.state.equipmentPackages.has(character.inventory.equipmentPackageId))
			{
				let oldPack = this.state.equipmentPackages.get(character.inventory.equipmentPackageId);
				Object.entries(oldPack.contents)
				.forEach(([section, contents]: [string, Map<number, number>]) =>
					contents.forEach((amount: number, itemId: number) =>
						inventoryOperations.removeItem(itemId, section, amount)
					)
				)
				inventoryOperations.addCredits(-oldPack.credits);
			}

			// Add the new pack if there is one
			if(this.state.equipmentPackages.has(id))
			{
				let newPack = this.state.equipmentPackages.get(id);
				Object.entries(newPack.contents)
				.forEach(([section, contents]: [string, Map<number, number>]) =>
					contents.forEach((amount: number, itemId: number) =>
						inventoryOperations.addItem(itemId, section, amount)
					)
				)
				inventoryOperations.addCredits(newPack.credits);
			}
			
			character.inventory.equipmentPackageId = id;
			this.setState({character});
		}

		// ----- META OPERATIONS E.G. CHARACTER EXPORT ----- //
		metaOperations.saveToFile = () =>
		{
			let character = this.state.character;
			let characterJson = JSON.stringify(character, replacer, 2);
			download(characterJson, "character-dl.json", "text/plain");
		}
		// Fix and sanitize the character object
		metaOperations.repairCharacter = (character: any) =>
		{
			let newCharacter = defaultCharacter;
			Object.keys(newCharacter).forEach(section => {
				if(character[section]) {
					newCharacter[section] = character[section];
				}
			})

			return newCharacter;
		}
		// Replace the character in state with that from a file uploaded by user
		metaOperations.loadFromFile = (file: FileType) =>
		{
			let fr = new FileReader();
			fr.readAsText(file.blobFile);

			fr.onload = () => {
				if(typeof(fr.result) === "string")
				{
					try
					{
						let loadedCharacter = JSON.parse(fr.result, reviver);
						loadedCharacter = metaOperations.repairCharacter(loadedCharacter);
						this.setState({ character: loadedCharacter });
					}
					catch(e)
					{
						console.error("Some error occured loading a character file", file, e);
					}
				}
			}

			fr.onerror = () => {
				console.error("Error reading file", file, fr.error);
			}
		}
		metaOperations.generatePdf = async () =>
		{
			// Get the template character sheet pdf and get the form in it
			// This form has text fields over every line of text
			// Text areas over input boxes and other appropriate form fields
			// pdf-lib allows us to get these fields and enter values into them
			let pdf = await this.fetchBlankSheet();
			const form = pdf.getForm();

			// Process the character for exporting
			let exportChar: CharacterExport = _.cloneDeep(this.state.character);

			// Calculate the modifiers for each attribute
			exportChar.attributes.modifiers = new Map(
				[...exportChar.attributes.finalValues.keys()].map(key => [key, attributeOperations.getModifier(key)])
			);
			// Create a concatenated list of all known technique ids
			exportChar.allPsychicTechniqueIds =
				[...exportChar.psychics.values()].map(psychic => psychic.knownTechniques)
					.reduce((prev, curr) => prev.concat(curr), []);

			// Seperate the main weapons and armours for display on page 1
			// Take the first 5 weapons from the inventory
			exportChar.inventory.mainWeapons = [...exportChar.inventory.weapons.keys()].slice(0, 4);
			// Remove 1 of each from the main inventory since the mainWeapons section is seperate
			exportChar.inventory.mainWeapons.forEach((weaponId) =>
			{
				if(exportChar.inventory.weapons.get(weaponId) === 1)
					exportChar.inventory.weapons.delete(weaponId);
				else
					exportChar.inventory.weapons.set(weaponId, exportChar.inventory.weapons.get(weaponId)-1);
			})
			// Likewise for the first 3 armours
			exportChar.inventory.mainArmours = [...exportChar.inventory.armours.keys()].slice(0, 2);
			exportChar.inventory.mainArmours.forEach((armourId) =>
			{
				if(exportChar.inventory.armours.get(armourId) === 1)
					exportChar.inventory.armours.delete(armourId);
				else
					exportChar.inventory.armours.set(armourId, exportChar.inventory.armours.get(armourId));
			})
			// And first 4 cyberwares
			exportChar.inventory.mainCyberwares = [...exportChar.inventory.cyberwares.keys()].slice(0, 2);
			exportChar.inventory.mainCyberwares.forEach((cyberwareId) =>
			{
				if(exportChar.inventory.cyberwares.get(cyberwareId) === 1)
					exportChar.inventory.cyberwares.delete(cyberwareId);
				else
					exportChar.inventory.cyberwares.set(cyberwareId, exportChar.inventory.cyberwares.get(cyberwareId));
			})
			
			// Find all the text fields and call a function to get their data based on their name
			form.getFields().forEach((field: PDFField) =>
			{
				if(field.constructor.name === "PDFTextField" && this.formFiller.has(field.getName()))
				{
					const textField = field as PDFTextField;
					const dataFun = this.formFiller.get(textField.getName());
					let data = "";
					try
					{
						data = dataFun(exportChar);
						if(data === null) data = "";
					}
					catch(e)
					{
						//console.warn("Caught error getting data for field", field.getName(), e);	
					}
					textField.setText(data);
				}
			});

			// Convert fields to simple text
			// TODO: allow user to choose whether this happens. Using the pdf form is valid
			form.flatten();
			const pdfBytes = await pdf.save();
			download(pdfBytes, "testPdf.pdf", "application/pdf")

			return pdf;
		}
		metaOperations.getNextStep = () =>
		{
			// If any stats are unrolled, or bonuses unspent, the attributes panel is next
			let attributes = this.state.character.attributes;
			if(
				([...attributes.rolledValues.values()].filter(x => x !== 0).length
				< this.state.ruleset.attributes.attributes.length)
					||
				(attributes.remainingBonuses.any + attributes.remainingBonuses.mental
				+ attributes.remainingBonuses.physical > 0)
			) return 1;

			// If the background is not confirmed, background panel is next
			if(!this.state.character.background.confirmed) return 2;

			// If any skill points remain unspent, skills panel is next
			let skills = this.state.character.skills;
			if(skills.skillPoints > 0 ||
				(skills.availableBonuses.any + skills.availableBonuses.combat
					+ skills.availableBonuses.noncombat > 0)
			) return 3;

			// If the class is not finalised, class panel is next
			if(!this.state.character.class.confirmed) return 4;

			// If any foci points are unspent, foci panel is next
			if(this.state.character.foci.canPlus !== null) return 5;

			// If any psychic points are unspent, psionic panel is next
			if(this.state.character.skills.availableBonuses.psychic > 0) return 6;

			// If an equipment package is not selected, equipment panel is next
			if(this.state.character.inventory.equipmentPackageId !== undefined) return 7;

			// Otherwise the character is complete, return the export panel
			return 8;
		}

		let character = _.cloneDeep(defaultCharacter);
		character.attributes.mode = defaultRuleset.attributes.modes[0];

		// Set initial state with operations above and default values
		this.state = {
			..._.cloneDeep(defaultObjectContext),
			character,
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
				meta: metaOperations,
			},
			ruleset: defaultRuleset,
			canPlusFoci: "any",
			queuedModals: [],
			currentPage: 0,
		};

		this.initCharacter(this.state.character);
	}

	// Initialise a characters ruleset dependant fields
	initCharacter = (character: Character = undefined) =>
	{
		if(character === undefined)
		{
			character = this.state.character;
			character.skills.availableBonuses.any = this.state.ruleset.skills.hobbies;
			character.foci.availablePoints.any = this.state.ruleset.foci.initialCount;
			character.foci.canPlus = this.state.operations.foci.getCanPlusFoci(character);
			this.setState({ character });
			return character;
		}

		character.skills.availableBonuses.any = this.state.ruleset.skills.hobbies;
		character.foci.availablePoints.any = this.state.ruleset.foci.initialCount;
		character.foci.canPlus = this.state.operations.foci.getCanPlusFoci(character);
		return character;
	}

	makeSkillChoiceModal = (choices: number[], source: number) => {
		console.log("looking for", choices, this.state.skills);
		let skills: Skill[] = findObjectsInMap(choices, false, this.state.skills, this.state.systemSkills);
		let cols: TypeAttributes.Color[] = ["red", "blue", "violet", "yellow"];
		return {
			header: <Modal.Header>
						<Modal.Title style={{textAlign: "center"}}>
							{ `Choose ${skills.map(skill => skill.name).join(" or ")} as a bonus skill` }
						</Modal.Title>
					</Modal.Header>,
			body:	<Modal.Body style={{paddingBottom: "16px"}} className="flexbox">
						{skills.map((skill, i) => 
							<Button key={skill.id} onClick={() => {
									this.clearActiveModal();
									this.state.operations.skills.upSkill(skill.id, {skill: source});
								}}
								style={{minWidth: "max-content", margin: "auto"}}
								color={cols[((i+1) % cols.length) - 1]} className="flex"
							>
								{skill.name}
							</Button>
						)}
					</Modal.Body>,
			footer: <Modal.Footer>
						<p style={{textAlign: "center"}}>
							You cannot close this modal without making a selection
						</p>
					</Modal.Footer>,
			backdrop: false,
		};
	}

	// Map of form field id to function that extracts the data for that field from a character
	// In rough order of the default app layout and within that, going left to right on the sheet
	formFiller = new Map<string, (c: CharacterExport) => string>([
		// General fields
		["Name", (character: CharacterExport) => character.name],
		["Class", (character: CharacterExport) => character.class.finalClass.name],
		["Class_Ability", (character: CharacterExport) =>
			character.class.finalClass.ability_descriptions.join("\n")],
		["Background", (character: CharacterExport) => character.background.confirmed
														? character.background.name
														: ""],
		["Ship Role", (character: CharacterExport) => ""], // TODO: Ships
		["Level", (character: CharacterExport) => character.level.toString()],
		["XP", (character: CharacterExport) => "0"],	// TODO: XP
		["Homeworld", (character: CharacterExport) => ""], // TODO: RP Background
		["Faction", (character: CharacterExport) => ""],
		["Species", (character: CharacterExport) => ""],	// TODO: Origin foci
		["Base_Attack", (character: CharacterExport) => character.attackBonus.toString()],
		["Skill Points", (character: CharacterExport) => character.skills.skillPoints.toString()],
		["Hitpoints", (character: CharacterExport) => character.finalHp.toString()],
		["Hitpoints_Conditions", (character: CharacterExport) => ""],	// TODO: Conditions
		["SysStrain_Permanent", (character: CharacterExport) => "0"], // TODO: System strain
		["Systrain", (character: CharacterExport) => ""],
		["Save_Physical", (character: CharacterExport) => character.saves.physical.toString()],
		["Save_Evasion", (character: CharacterExport) => character.saves.evasion.toString()],
		["Save_Mental", (character: CharacterExport) => character.saves.mental.toString()],
		
		// Attributes
		["Attribute_STR", (character: CharacterExport) =>
			character.attributes.finalValues.get("str").toString()],
		["Attribute_STR_Mod", (character: CharacterExport) =>
			character.attributes.modifiers.get("str") >= 0
			? `+${character.attributes.modifiers.get("str")}`
			: character.attributes.modifiers.get("str").toString()],
		["Attribute_DEX", (character: CharacterExport) =>
			character.attributes.finalValues.get("dex").toString()],
		["Attribute_DEX_Mod", (character: CharacterExport) =>
			character.attributes.modifiers.get("dex") >= 0
			? `+${character.attributes.modifiers.get("dex")}`
			: character.attributes.modifiers.get("dex").toString()],
		["Attribute_CON", (character: CharacterExport) =>
			character.attributes.finalValues.get("con").toString()],
		["Attribute_CON_Mod", (character: CharacterExport) =>
			character.attributes.modifiers.get("con") >= 0
			? `+${character.attributes.modifiers.get("con")}`
			: character.attributes.modifiers.get("con").toString()],
		["Attribute_INT", (character: CharacterExport) =>
			character.attributes.finalValues.get("int").toString()],
		["Attribute_INT_Mod", (character: CharacterExport) =>
			character.attributes.modifiers.get("int") >= 0
			? `+${character.attributes.modifiers.get("int")}`
			: character.attributes.modifiers.get("int").toString()],
		["Attribute_WIS", (character: CharacterExport) =>
			character.attributes.finalValues.get("wis").toString()],
		["Attribute_WIS_Mod", (character: CharacterExport) =>
			character.attributes.modifiers.get("wis") >= 0
			? `+${character.attributes.modifiers.get("wis")}`
			: character.attributes.modifiers.get("wis").toString()],
		["Attribute_CHA", (character: CharacterExport) =>
			character.attributes.finalValues.get("cha").toString()],
		["Attribute_CHA_Mod", (character: CharacterExport) =>
			character.attributes.modifiers.get("cha") >= 0
			? `+${character.attributes.modifiers.get("cha")}`
			: character.attributes.modifiers.get("cha").toString()],

		// Skill field functions are created when skills are loaded. Skills can be added via the database
		// TODO: Psychic skills appearing in skills table

		// Foci
		// Get foci names
		...[1,2,3,4,5,6].map(focusNo =>
		[`Focus_${focusNo}_Line1`, (character: CharacterExport) =>
		{
			if((focusNo-1) > character.foci.chosenFoci.size) return "";
			// Return the name of the focusNo'th foci in the chosenFoci map
			return this.state.foci.get([...character.foci.chosenFoci.entries()][focusNo-1][0]).name;
		}
		] as FormMapMaker),
		// TODO: line 1 = description?
		// TODO: line 2
		// Get foci levels
		...[1,2,3,4,5,6].map(focusNo =>
		[`Focus_${focusNo}_Level`, (character: CharacterExport) =>
		{
			if((focusNo-1) > character.foci.chosenFoci.size) return "";
			// Return the level of the focusNo'th foci in the chosenFoci map
			return [...character.foci.chosenFoci.entries()][focusNo-1][1].toString();
		}
		] as FormMapMaker),

		// Psychics
		["Skill_Biopsionics", (character: CharacterExport) =>
			character.psychics.has(1)? character.psychics.get(1).level.toString() : ""],
		["Skill_Metapsionics", (character: CharacterExport) =>
			character.psychics.has(2)? character.psychics.get(2).level.toString() : ""],
		["Skill_Precognition", (character: CharacterExport) =>
			character.psychics.has(3)? character.psychics.get(3).level.toString() : ""],
		["Skill_Telekinesis", (character: CharacterExport) =>
			character.psychics.has(4)? character.psychics.get(4).level.toString() : ""],
		["Skill_Telepathy", (character: CharacterExport) =>
			character.psychics.has(5)? character.psychics.get(5).level.toString() : ""],
		["Skill_Teleportation", (character: CharacterExport) =>
			character.psychics.has(6)? character.psychics.get(6).level.toString() : ""],
		// Psychic techniques
		...[1,2,3,4,5,6,7,8,9,10,11,12].map(psionicNo =>
		[`Psionic_${psionicNo}`, (character: CharacterExport) =>
		{
			if((psionicNo-1) > character.allPsychicTechniqueIds.length) return "";
			return this.state.psychicPowers.get(character.allPsychicTechniqueIds[psionicNo-1]).name;
		}
		] as FormMapMaker),
		["Psionic_Effort_Usage", (character: CharacterExport) => ""],
		["Psionic_Effort", (character: CharacterExport) =>
		{
			let effort = 1;
			effort += Math.max(...["wis","con"].map(character.attributes.modifiers.get));
			if(character.psychics.size > 0)
				effort += [...character.psychics.entries()].map(psychic => psychic[1].level)
					.sort((a, b) => b - a)[0]
			return effort.toString();
		}],

		// Items (first page)
		["Credits", (character: CharacterExport) => character.inventory.credits.toString()],
		["Debts", (character: CharacterExport) => "0"],	// TODO: Debts
		// 5 main weapons. Each weapon has several fields
		...[1,2,3,4,5].map(weaponNo =>
		{
			// For each weapon we are creating several fields showing it's stats
			return [
				[`Weapon_${weaponNo}_Name`, (character: CharacterExport) =>
					character.inventory.mainWeapons.length > (weaponNo-1)
						? this.state.items.weapons.get(character.inventory.mainWeapons[weaponNo-1]).name
						: ""],
				[`Weapon_${weaponNo}_Range1`, (character: CharacterExport) =>
					character.inventory.mainWeapons.length > (weaponNo-1)
						? this.state.items.weapons.get(character.inventory.mainWeapons[weaponNo-1]).range_low.toString()
						: ""],
				[`Weapon_${weaponNo}_Range2`, (character: CharacterExport) =>
					character.inventory.mainWeapons.length > (weaponNo-1)
						? this.state.items.weapons.get(character.inventory.mainWeapons[weaponNo-1]).range_high.toString()
						: ""],
				[`Weapon_${weaponNo}_Mods`, (character: CharacterExport) =>
					character.inventory.mainWeapons.length > (weaponNo-1)? "" : ""], // TODO: Mods
				[`Weapon_${weaponNo}_Magazine`, (character: CharacterExport) =>
					character.inventory.mainWeapons.length > (weaponNo-1)
						? this.state.items.weapons.get(character.inventory.mainWeapons[weaponNo-1]).magazine
						: ""],
				[`Weapon_${weaponNo}_Attack`, (character: CharacterExport) =>
				{
					if(character.inventory.mainWeapons.length > (weaponNo-1))
					{
						// Get the weapon object we are referring to
						let weapon = this.state.items.weapons.get(
							character.inventory.mainWeapons[weaponNo-1]);
						// The attack modifier for a weapon is base attack bonus + skill + the attribute modifier relevant to the weapon
						// Some weapons have multiple stats, the highest relevant modfier is then taken
						return Number(
							character.attackBonus
							+ (character.skills.earntSkills.has(weapon.skill_id)
								? character.skills.earntSkills.get(weapon.skill_id).level
								: -1)
							// Take the maximum of all modifiers found
							+ Math.max(
								// Get the attribute(s) it takes, splitting on / to find any with multiple
								...weapon.attribute.toLowerCase().split("/").map(statKey =>
									// Get the modifier for each stat found (usually only 1 stat)
									character.attributes.modifiers.get(statKey)
								)
							)
						).toString()
					}
					else return "";
				}],
				[`Weapon_${weaponNo}_Damage`, (character: CharacterExport) =>
					this.state.items.weapons.get(character.inventory.mainWeapons[weaponNo-1]).damage],
			] as FormMapMaker[]
		// Created an array of arrays or what we want via map, need to reduce that to an array of what we want
		}).reduce(arrayReducer),
		// 3 main armours. Each armour has several fields
		...[1,2,3].map(armourNo =>
		{
			// For each weapon we are creating several fields showing it's stats
			return [
				[`Armor_${armourNo}_Name`, (character: CharacterExport) =>
					character.inventory.mainArmours.length > (armourNo-1)
						? this.state.items.armours.get(character.inventory.mainArmours[armourNo-1]).name
						: ""],
				[`Armor_${armourNo}_Mods`, (character: CharacterExport) =>
					character.inventory.mainArmours.length > (armourNo-1)? "" : ""], // TODO: Mods
				[`Armor_${armourNo}_AC`, (character: CharacterExport) =>
					character.inventory.mainArmours.length > (armourNo-1)
						? Number(this.state.items.armours.get(character.inventory.mainArmours[armourNo-1])
							.armour_class + character.attributes.modifiers.get("dex")).toString()
						: ""
				],
			] as FormMapMaker[]
		// Created an array of arrays or what we want via map, need to reduce that to an array of what we want
		}).reduce(arrayReducer),
		// 4 main cyberwares. Only displaying their names
		...[1,2,3,4].map(cyberwareNo =>
		[`Innate_${cyberwareNo}`, (character: CharacterExport) =>
			character.inventory.mainCyberwares.length > (cyberwareNo-1)
				? this.state.items.cyberwares.get(character.inventory.mainCyberwares[cyberwareNo-1]).name
				: ""
		] as FormMapMaker),

		// Items (page 2)
		// Stowed equipment names
		...[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(stowedNo =>
		[`Stowed_.${stowedNo}`, (character: CharacterExport) =>
		{
			let workingIndex = stowedNo;
			if((workingIndex - character.inventory.armours.size) < 0)
			{
				let id = [...character.inventory.armours.entries()][workingIndex][0];
				return `${character.inventory.armours.get(id)}x ${this.state.items.armours.get(id).name}`;
			}
			workingIndex -= character.inventory.armours.size;
			if((workingIndex - character.inventory.equipments.size) < 0)
			{
				let id = [...character.inventory.equipments.entries()][workingIndex][0];
				return `${character.inventory.equipments.get(id)}x ${this.state.items.equipments.get(id).name}`;
			}
			workingIndex -= character.inventory.equipments.size;
			if((workingIndex - character.inventory.weapons.size) < 0)
			{
				let id = [...character.inventory.weapons.entries()][workingIndex][0];
				return `${character.inventory.weapons.get(id)}x ${this.state.items.weapons.get(id).name}`;
			}
			workingIndex -= character.inventory.weapons.size;
			
			return "";
		}] as FormMapMaker),
		// Stowed equipment encumbrance
		...[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(stowedNo =>
		[`Stowed_Enc_.${stowedNo}`, (character: CharacterExport) =>
		{
			let workingIndex = stowedNo;
			if((workingIndex - character.inventory.armours.size) < 0)
			{
				let id = [...character.inventory.armours.entries()][workingIndex][0];
				return Number(character.inventory.armours.get(id) * this.state.items.armours.get(id).encumbrance).toString().substring(0, 3);
			}
			workingIndex -= character.inventory.armours.size;
			if((workingIndex - character.inventory.equipments.size) < 0)
			{
				let id = [...character.inventory.equipments.entries()][workingIndex][0];
				return Number(character.inventory.equipments.get(id) * this.state.items.equipments.get(id).encumbrance).toString().substring(0, 3);
			}
			workingIndex -= character.inventory.equipments.size;
			if((workingIndex - character.inventory.weapons.size) < 0)
			{
				let id = [...character.inventory.weapons.entries()][workingIndex][0];
				return Number(character.inventory.weapons.get(id) * this.state.items.weapons.get(id).encumbrance).toString().substring(0, 3);
			}
			workingIndex -= character.inventory.weapons.size;
			
			return "";
		}] as FormMapMaker),
		// Non-Encumbering equipment
		...[0,1,2,3,4].map(nonEncNo =>
		[`NonEnc_.${nonEncNo}`, (character: CharacterExport) =>
		{
			let workingIndex = nonEncNo;
			if((workingIndex - character.inventory.stims.size) < 0)
			{
				let id = [...character.inventory.stims.entries()][workingIndex][0];
				return `${character.inventory.stims.get(id)}x ${this.state.items.stims.get(id).name}`;
			}
			workingIndex -= character.inventory.stims.size;
			if((workingIndex - character.inventory.cyberwares.size) < 0)
			{
				let id = [...character.inventory.cyberwares.entries()][workingIndex][0];
				return `${character.inventory.cyberwares.get(id)}x ${this.state.items.cyberwares.get(id).name}`;
			}
			workingIndex -= character.inventory.cyberwares.size;

			return "";
		}] as FormMapMaker),
	]);

	// Functions to be run when system skills are learnt in addition to adding them to sheet
	earnSystemSkill = new Map<number, () => void>([
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
			this.setState({ character });
		}],
		[23, () => {
			let character = this.state.character;
			character.attributes.bonuses.push({
				skill_id: 23,
				name: "+2 physical",
				description: "Distribute 2 points as you please amongst physical attributes",
				type: "physical",
				bonus: 2,
			})
			character.attributes.remainingBonuses.physical += 2;
			this.setState({ character });
		}],
		[24, () => {
			let character = this.state.character;
			character.attributes.bonuses.push({
				skill_id: 24,
				name: "+2 mental",
				description: "Distribute 2 points as you please amongst mental attributes",
				type: "mental",
				bonus: 2,
			})
			character.attributes.remainingBonuses.mental += 2;
			this.setState({ character });
		}],
		[25, () => {
			let character = this.state.character;
			character.skills.availableBonuses.any++;
			this.setState({ character });
		}],
		[26, () => {
			// Let player choose between shoot or trade in a modal
			this.setActiveModal(this.makeSkillChoiceModal([12, 17], 26));
		}],
		[27, () => {
			// Let player choose between stab or shoot in a modal
			this.setActiveModal(this.makeSkillChoiceModal([14, 12], 26));
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
		// These system skill functions are run after the skill is added to the player
		// Therefore, these need only trigger a recalculation, which will account for them
		[31, () => this.state.operations.general.calculateHp()],
		[32, () => this.state.operations.general.calculateAc()],
	]);
	removeSystemSkill = new Map<number, () => void>([
		[19, () => {
			let character = this.state.character;
			character.skills.availableBonuses.combat--;
			// TODO: may need to unlearn one combat skill if then at -1 available bonuses
			this.setState({ character });
		}],
		[20, () => {
			let character = this.state.character;
			character.skills.availableBonuses.noncombat--;
			// TODO: may need to unlearn one noncombat skill if then at -1 available bonuses
			this.setState({ character });
		}],
		[21, () => {
			let character = this.state.character;
			character.skills.availableBonuses.psychic--;
			// TODO: may need to unlearn one psychic skill if then at -1 available bonuses
			this.setState({ character });
		}],
		[22, () => {
			let character = this.state.character;
			// Remove the first bonus of this type the player has
			for(let i = 0;  i < character.attributes.bonuses.length; i++)
			{
				if(character.attributes.bonuses[i].skill_id === 22)
				{
					character.attributes.bonuses.splice(i, 1);
					break;
				}
			}
			character.attributes.remainingBonuses.any--;
			this.setState({ character });
		}],
		[23, () => {
			let character = this.state.character;
			// Remove the first bonus of this type the player has
			for(let i = 0;  i < character.attributes.bonuses.length; i++)
			{
				if(character.attributes.bonuses[i].skill_id === 23)
				{
					character.attributes.bonuses.splice(i, 1);
					break;
				}
			}
			character.attributes.remainingBonuses.physical -= 2;
			this.setState({ character });
		}],
		[24, () => {
			let character = this.state.character;
			// Remove the first bonus of this type the player has
			for(let i = 0;  i < character.attributes.bonuses.length; i++)
			{
				if(character.attributes.bonuses[i].skill_id === 24)
				{
					character.attributes.bonuses.splice(i, 1);
					break;
				}
			}
			character.attributes.remainingBonuses.mental -= 2;
			this.setState({ character });
		}],
		[25, () => {
			let character = this.state.character;
			character.skills.availableBonuses.any--;
			// TODO: may need to reduce 1 skill if we then have -1 any bonuses
			this.setState({ character });
		}],
		[26, () => {
			// Remove shoot or trade
			let skillIds = [12, 17]
			let earntSkills = skillIds
						.map(id => this.state.character.skills.earntSkills.get(id))
			
			for(let i = 0; i < earntSkills.length; i++)
			{
				if(earntSkills[i] === undefined) break;
				if(earntSkills[i].skillSources.includes(26))
				{
					// If we find a skill gained from us, remove it and return since we only take 1
					this.state.operations.skills.downSkill(skillIds[i]);
					return;
				}
			}
			console.warn("Tried to remove a skill from", skillIds, "but none were granted by 26");
		}],
		[27, () => {
			// Remove stab or shoot
			let skillIds = [14, 12]
			let earntSkills = skillIds
						.map(id => this.state.character.skills.earntSkills.get(id))
			
			for(let i = 0; i < earntSkills.length; i++)
			{
				if(earntSkills[i] === undefined) break;
				if(earntSkills[i].skillSources.includes(26))
				{
					// If we find a skill gained from us, remove it and return since we only take 1
					this.state.operations.skills.downSkill(skillIds[i]);
					return;
				}
			}
			console.warn("Tried to remove a skill from", skillIds, "but none were granted by 27");
		}],
		[28, () => {
			let character = this.state.character;
			character.foci.availablePoints.combat--;
			// TODO: may need to reduce 1 combat focus if we then have -1 bonuses
			this.setState({ character });
		}],
		[29, () => {
			let character = this.state.character;
			character.foci.availablePoints.noncombat--;
			// TODO: may need to reduce 1 noncombat focus if we then have -1 bonuses
			this.setState({ character });
		}],
		[30, () => {
			let character = this.state.character;
			character.foci.availablePoints.any--;
			// TODO: may need to reduce 1 any focus if we then have -1 bonuses
			this.setState({ character });
		}],
		// These system skill functions are run after the skill is removed from the player
		// Therefore, these need only trigger a recalculation, which will account for them
		[31, () => this.state.operations.general.calculateHp()],
		[32, () => this.state.operations.general.calculateAc()],
	]);

	repairRuleset = (ruleset: any) =>
	{
		let newRuleset = defaultRuleset;
		Object.keys(newRuleset).forEach(section => {
			if(ruleset[section]) {
				newRuleset[section] = ruleset[section];
			}
		})

		return newRuleset;
	}

	loadRuleset = (file: FileType) =>
	{
		let fr = new FileReader();
		fr.readAsText(file.blobFile);

		fr.onload = () => {
			if(typeof(fr.result) === "string")
			{
				try
				{
					let loadedRuleset = JSON.parse(fr.result, reviver);
					loadedRuleset = this.repairRuleset(loadedRuleset);
					// Also reset the character if they're changing the ruleset
					this.setState({
						ruleset: loadedRuleset,
						character: _.cloneDeep(defaultCharacter)
					});
					this.initCharacter();
				}
				catch(e)
				{
					console.error("Some error occured loading a ruleset file", file, e);
				}
			}
		}

		fr.onerror = () => {
			console.error("Error reading file", file, fr.error);
		}
	}

	saveRuleset = () =>
	{
		let ruleset = this.state.ruleset;
		let rulsetJson = JSON.stringify(ruleset, replacer, 2);
		download(rulsetJson, "ruleset-dl.json", "text/plain");
	}

	saveDefaultRuleset = () =>
	{
		let rulsetJson = JSON.stringify(defaultRuleset, replacer, 2);
		download(rulsetJson, "ruleset-dl.json", "text/plain");
	}
	

	setActiveModal = (activeModal: {
		header: React.ReactElement, body: React.ReactElement,
		footer?: React.ReactElement, onExit?: () => void,
		backdrop?: boolean | "static"}) =>
	{
		if(!this.state.activeModal) this.setState({activeModal});
		else this.setState({queuedModals: this.state.queuedModals.concat(activeModal)});
	}

	clearActiveModal = () =>
	{
		if(this.state.queuedModals.length > 0)
		{
			this.setState({
				activeModal: this.state.queuedModals[0],
				queuedModals: this.state.queuedModals.slice(1)
			});
		}
		else this.setState({activeModal: undefined});
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

		// Calculate the initial values for general stats
		this.state.operations.general.recaulculate();
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
		.then(skills =>
		{
			this.setState({
				skills: objectToMap<Skill>(skills["nonsystem"]),
				systemSkills: objectToMap<Skill>(skills["system"]),
			});
			// Now we know the list of skills, we can make getters for the data for their fields in the exported form
			this.formFiller = new Map([
				// Get the formFillers current entries and spread them into a new map
				...this.formFiller.entries(),
				// There is a field for the level of every skill in the form fillable pdf
				// Map the list of skills to a list of pairs of their field id, and a function to get the value
				// Spread this list into the map we're creating to save typing out an entry for every skill
				// This also allows it to easily respond to changes in the database
				...[...this.state.skills.values()].map((skill: Skill) =>
				{ 
					return (
						[`Skill_${skill.name}`, (character: CharacterExport) =>
							character.skills.earntSkills.has(skill.id)
							? character.skills.earntSkills.get(skill.id).level.toString()
							: ""
						] as [string, (c: CharacterExport) => string]
					);
				})
			]);
		});
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

	async fetchBlankSheet()
	{
		let pdfBytes = await fetch('Stars_Without_Number_Character_Sheet.pdf')
					.then(res => res.arrayBuffer());
		const pdfDoc = await PDFDocument.load(pdfBytes);
		return pdfDoc;
	}
	// ************ End fetchers ***************** //

	removeCharacterSection = (key: string) =>
	{
		let character = this.state.character;
		character[key] = null;
		this.setState({ character });
	}

	getPage()
    {
        switch(this.state.currentPage)
        {
            case 0:
                return <IntroPanel />;
            case 1:
                return <AttributesPanel
                    attributeRuleset={this.state.ruleset.attributes}
                    modifiers={ this.state.ruleset.attributes.modifiers }
                    defaultMode={ this.state.ruleset.attributes.modes[0] }
                />;
            case 2:
                return <BackgroundsPanel
                    tableRolls={ this.state.ruleset.background.tableRolls }
                />;
            case 3: 
                return <SkillsPanel />;
            case 4:
                return <ClassPanel />;
            case 5:
                return <FociPanel />;
            case 6:
                return <PsychicPowersPanel />;
            case 7:
                return <EquipmentPanel />;
            case 8:
                return <ExportingPanel
                    loadRuleset={this.loadRuleset}
                    saveDefaultRuleset={this.saveDefaultRuleset}
                    saveRuleset={this.saveRuleset}
                />;
            default:
                return <h2>Error unknown page</h2>;
        }
    }

	setPage(newPage: number)
    {
        this.setState({
			currentPage: newPage < 0
				? 0 
				: newPage > 8
					? 8
					: newPage
		})
    }

	render()
	{
		return (
			/*
				Context providers allow their data to be accessed by any child component
				via a context consumer or similar mechanism.
				The player character and game object store is passed around like this
			*/
		<GameObjectContext.Provider value={this.state}>
			<CharacterContext.Provider value={ this.state }>
				<div className="navigation-header">
					<Steps current={this.state.currentPage} className="navigation-steps">
						<Steps.Item title="Intro" description="" />
						<Steps.Item title="Attributes" description="" />
						<Steps.Item title="Background" description="" />
						<Steps.Item title="Skills" description="" />
						<Steps.Item title="Class" description="" />
						<Steps.Item title="Foci" description="" />
						<Steps.Item title="Psionics" description="" />
						<Steps.Item title="Equipment" description="" />
						<Steps.Item title="Export" description="" />
					</Steps>

					<GeneralPanel />
				</div>
				<div className="scg">

					{ this.getPage() }

				</div>
				<div className="navigation-footer">
					<div className="button-container">
						<ButtonGroup>
							<Button
								onClick={() => this.setPage(this.state.currentPage-1)}
								disabled={this.state.currentPage === 0}
							>
								Back
							</Button>
							<Button
								onClick={() => this.setPage(this.state.currentPage+1)}
								disabled={this.state.currentPage === 8}
							>
								Forward
							</Button>
						</ButtonGroup>
						<ButtonGroup>
							<Button
								onClick={() => this.state.operations.meta.saveToFile()}
							>
								Quick Save
							</Button>
							<Button
								onClick={() => this.setPage(this.state.operations.meta.getNextStep())}
								disabled={this.state.currentPage === 8}
							>
								Next Step
							</Button>
						</ButtonGroup>
					</div>
				</div>

				{ 	// If there is an active modal stored in state, display it here
					// This allows any component or function to trigger a modal simply by setting state
					this.state.activeModal &&
					<Modal show={true}
						onHide={() => {
							if(this.state.activeModal.onExit)
								this.state.activeModal.onExit();
							this.clearActiveModal();
						}}
					>
						{ this.state.activeModal.header }
						{ this.state.activeModal.body }
						{ this.state.activeModal.footer
							? this.state.activeModal.footer
							:
							<Modal.Footer>
								<Button onClick={() => {
									if(this.state.activeModal.onExit)
										this.state.activeModal.onExit();
									this.clearActiveModal();
								}}
									appearance="primary"
								>
									OK
								</Button>
							</Modal.Footer>
						}
					</Modal>
				}
			</CharacterContext.Provider>
		</GameObjectContext.Provider>
		);
	}
}

export default Scg;