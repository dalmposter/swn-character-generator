import { Background, Skill, PlayerClass, Focus, PsychicDiscipline, PsychicPower, Armour, Cyberware, Equipment, Stim, Weapon } from "../../types/Object.types";
import { Character } from "./character.types";
import { ScgRuleset } from "./ruleset.types";
import { GameObjectsContext } from "./Scg.types";

// Default ruleset. Represents the games actual rules
export const defaultRuleset: ScgRuleset = {
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
				fixedValues: [14],
			},
			{
				key: "choice-roll",
				type: "hybrid",
				dice: 3,
				sides: 6,
				startingValue: 0,
				fixedValues: [],
			}
		],
		modifiers: new Map([
			[3, -2],
			[4, -1], [5, -1], [6, -1], [7, -1],
			[8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, 0],
			[14, 1], [15, 1], [16, 1], [17, 1],
			[18, 2]
		]),
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
		initialCount: 1,
	},
	psychics: {
		canSpendBonusAnySkill: true,
	},
	equipment: {
		startingCredits: {
			numberDice: 2,
			numberSides: 6,
			multiplier: 100,
		},
	},
	general: {
		baseSave: 16,
		baseAC: 10,
		baseAttackBonus: 0,
	}
}

// Default character state (for testing)
export const defaultCharacter: Character = {
	playerName: "",
	name: "",
	rolledHp: 0,
	finalHp: 0,
	level: 1,
	attackBonus: 0,
	ac: 0,
	saves: {
		physical: 0,
		evasion: 0,
		mental: 0,
	},
	attributes: {
		rolledValues: new Map(Object.entries({dex: 0, str: 0, con: 0, int: 0, wis: 0, cha: 0})),
		bonusValues: new Map(Object.entries({dex: 0, str: 0, con: 0, int: 0, wis: 0, cha: 0})),
		finalValues: new Map(Object.entries({dex: 0, str: 0, con: 0, int: 0, wis: 0, cha: 0})),
		remainingBonuses: {
			any: 0,
			physical: 0,
			mental: 0,
		},
		bonuses: [],
	},
	background: {
		id: 0,
		name: "Physician",
		quick: true,
		rolledSkillIds: [],
		confirmed: false,
	},
	skills: {
		anySpentOnPsychics: 0,
		availableBonuses: {
			any: 0,
			psychic: 0,
			combat: 0,
			noncombat: 0,
		},
		spentBonuses: {
			any: 0,
			psychic: 0,
			combat: 0,
			noncombat: 0,
		},
		earntSkills: new Map(),
		skillPoints: 0,
	},
	class: {
		classIds: new Set(),
		confirmed: false,
	},
	foci: {
		availablePoints: {
			any: 0,
			combat: 0,
			noncombat: 0,
		},
		spentPoints: {
			any: 0,
			combat: 0,
			noncombat: 0,
		},
		chosenFoci: new Map(),
		canPlus: null,
	},
	psychics: new Map(),
	inventory: {
		credits: 0,
		armours: new Map(),
		cyberwares: new Map(),
		equipments: new Map(),
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