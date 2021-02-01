import { Background, Skill, PlayerClass, ClassDescription, Focus, PsychicDiscipline, PsychicPower, Armour, Cyberware, Equipment, Stim, Weapon } from "../../types/Object.types";
import { Character } from "./character.types";
import { ScgRuleset } from "./ruleset.types";
import { GameObjectsContext } from "./Scg.types";

// Default ruleset. Represents the games actual rules
export const defaultRules: ScgRuleset = {
	attributes: {
		attributes: [
			{
				name: "Strength",
				key: "str",
				type: "physical",
				description: "Physical prowess, melee combat, carrying gear, brute force."
			},
			{
				name: "Dexterity",
				key: "dex",
				type: "physical",
				description: "Speed, evasion, manual dexterity, reaction time, combat initiative."
			},
			{
				name: "Constitution",
				key: "con",
				type: "physical",
				description: "Hardiness, enduring injury, resisting toxins, going without food or sleep."
			},
			{
				name: "Intelligence",
				key: "int",
				type: "mental",
				description: "Memory, reasoning, technical skills, general education."
			},
			{
				name: "Wisdom",
				key: "wis",
				type: "mental",
				description: "Noticing things, making judgments, reading situations, intuition."
			},
			{
				name: "Charisma",
				key: "cha",
				type: "mental",
				description: "Commanding, charming, attracting attention, being taken seriously."
			}
		],
		modes: [
			{
				key: "classic-array",
				type: "array",
				array: [14, 12, 12, 10, 9, 7],
			},
			{
				key: "classic-roll",
				type: "roll",
				dice: 3,
				sides: 6,
				startingValue: 0,
				fixedValues: [14, 16],
			},
			{
				key: "choice-roll",
				type: "hybrid",
				dice: 3,
				sides: 6,
				startingValue: 0,
				fixedValues: [],
			}
		]
	},
	background: {
		tableRolls: 3,
	},
	skills: {
		hobbies: 1,
	},
	class: {
		multiCount: 2,
	},
	foci: {

	},
	psychics: {
		maxDisciplines: 2,
	},
	equipment: {
		startingCredits: {
			numberDice: 2,
			numberSides: 6,
			multiplier: 100,
		},
	},
}

// Default character state (for testing)
export const defaultCharacter: Character = {
	attributes: {
		values: new Map(Object.entries({dex: 0, str: 0, con: 0, int: 0, wis: 0, cha: 0})),
		bonusValues: new Map(Object.entries({dex: 0, str: 0, con: 0, int: 0, wis: 0, cha: 0})),
		remainingBonuses: new Map(Object.entries({any: 1, physical: 2, mental: 2})),
		bonuses: [{
			skill_id: 23,
			name: "+2 Physical",
			description: "Gain 2 physical stats",
			type: "physical",
			maxBonus: 2,
		},
		{
			skill_id: 24,
			name: "+2 Mental",
			description: "Gain 2 mental stats",
			type: "mental",
			maxBonus: 2,
		},
		{
			skill_id: 22,
			name: "+1 Any",
			description: "Gain 1 of any stat",
			type: "any",
			maxBonus: 1,
		}],
	},
	background: {
		value: 0,
	},
	skills: {
		availablePoints: {
			any: 2,
			nonpsychic: 1,
			combat: 0,
			noncombat: 0,
		},
		spentPoints: {
			any: 3,
			nonpsychic: 1,
			combat: 0,
			noncombat: 0,
		},
		earntSkills: new Map([
			[0, {level: 0, spentPoints: 1}],
			[3, {level: 1, spentPoints: 2}],
			[16, {level: 0, spentPoints: 1}]
		]),
	},
	class: {
		classIds: [],
	},
	foci: {
		availablePoints: {
			any: 2,
			combat: 1,
			noncombat: 0,
		},
		spentPoints: {
			any: 0,
			combat: 0,
			noncombat: 1,
		},
		chosenFoci: new Map([
			[1, 1]
		]),
	},
	psychics: new Map([
		[1, {
			level: 1,
			knownSkills: [1],
			unspentPoints: 0,
		}],
		[2, {
			level: 0,
			knownSkills: [],
			unspentPoints: 0,
		}]
	]),
	inventory: {
		credits: 0,
		armours: new Map(),
		cyberwares: new Map(),
		equipment: new Map(),
		weapons: new Map(),
		stims: new Map()
	}
};

export const defaultObjectContext: GameObjectsContext = {
	backgrounds: new Map<number, Background>(),
	skills: new Map<number, Skill>(),
	systemSkills: new Map<number, Skill>(),
	classes: {
		system: new Map<number, PlayerClass>(),
		nonsystem: new Map<number, PlayerClass>(),
	},
	classDescriptions: new Map<number, ClassDescription>(),
	foci: new Map<number, Focus>(),
	psychicDisciplines: new Map<number, PsychicDiscipline>(),
	psychicPowers: new Map<number, PsychicPower>(),
	items: {
		armours: new Map<number, Armour>(),
		cyberwares: new Map<number, Cyberware>(),
		equipments: new Map<number, Equipment>(),
		stims: new Map<number, Stim>(),
		weapons: new Map<number, Weapon>(),
	},
	equipmentPackages: new Map(),
}