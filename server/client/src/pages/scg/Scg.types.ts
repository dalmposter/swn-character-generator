import React from "react";
import { AttributeBonus, Background, ClassDescription, Focus, PlayerClass,
	PsychicDiscipline, PsychicPower, Skill } from "../../types/Object.types";

export interface ScgProps {
	
}

export interface ScgState extends GameObjectsContext {
	ruleset: ScgRuleset;
	character: Character;
	canPlusFoci: "any" | "combat" | "noncombat";
}

export const GameObjectContext = React.createContext<GameObjectsContext>({
	backgrounds: new Map(),
	skills: new Map(),
	systemSkills: new Map(),
	classes: {
		system: new Map(), 
		nonsystem: new Map(),
	},
	foci: new Map(),
	classDescriptions: new Map(),
	psychicDisciplines: new Map(),
	psychicPowers: new Map(),
});

export const CharacterContext = React.createContext<Character>({
	attributes: {
		values: new Map(),
		bonuses: [],
	}
});

// The store of game objects
export interface GameObjectsContext
{
	backgrounds: Map<number, Background>;
	skills: Map<number, Skill>;
	systemSkills: Map<number, Skill>;
	classes: {
		system: Map<number, PlayerClass>;
		nonsystem: Map<number, PlayerClass>;
	};
	classDescriptions: Map<number, ClassDescription>;
	foci: Map<number, Focus>;
	psychicDisciplines: Map<number, PsychicDiscipline>,
	psychicPowers: Map<number, PsychicPower>,
}

// Attributes section of a saved character
export interface CharacterAttributes {
	values: Map<string,number>;
	mode?: string;
	bonuses: AttributeBonus[];
}

// Backgrounds section of a saved character
export interface CharacterBackground {
	value: number;
	quick?: boolean;
	growthRolls?: number[];
	learningRolls?: number[];
}

// Represents 1 skill having been earnt to any level
export interface EarntSkill
{
	level: number;
	spentPoints?: number
}

export interface SkillPoints
{
	any: number;
	nonpsychic: number;
	combat: number;
	noncombat: number;
}

// Skills section of a saved character
export interface CharacterSkills
{
	availablePoints: SkillPoints;
	spentPoints: SkillPoints;
	earntSkills: Map<number, EarntSkill>;
}

// Class section of a saved character
export interface CharacterClass
{
	classIds: number[];
}

// A saved character
export interface Character
{
	attributes?: CharacterAttributes;
	background?: CharacterBackground;
	skills?: CharacterSkills;
	class?: CharacterClass;
	foci?: CharacterFoci;
	psychics?: Map<number, CharacterPsychic>;
}

export interface CharacterPsychic
{
	level: number;
	knownSkills: number[];
	unspentPoints: number;
}

export interface FocusPoints
{
	any: number;
	combat: number;
	noncombat: number;
}

//Foci section of a saved character
export interface CharacterFoci
{
	chosenFoci: Map<number, number>;
	availablePoints: FocusPoints;
	spentPoints: FocusPoints;
}

export type FocusType = "combat" | "noncombat" | "any";

export interface Attribute {
	name: string;
	key: string;
	description: string;
}

export type AttributeMode = RollMode | ArrayMode;

// Customisation object for attribute rolling behaviour
export interface RollMode {
	key: string;
	type: "roll" | "hybrid";
	dice: number;
	sides: number;
	fixedValues?: number[];
	startingValue: number;
}

// Customisation object for attribute array behaviour
export interface ArrayMode {
	key: string;
	type: "array";
	array: number[];
}

// Customisation object for attribute behaviour
export interface AttributeRuleset {
	attributes: Attribute[];
	modes: AttributeMode[];
}

// Customisation object for background behaviour
export interface BackgroundRuleset
{
	tableRolls: number;
}

// Customisation object for skill behaviour
export interface SkillRuleset {
	hobbies: number;
}

// Customisation object for class behaviour
export interface ClassRuleset {
	multiCount: number;
}

export interface FociRuleset
{

}

export interface PsychicsRuleset
{
	maxDisciplines: number;
}

// Customisation object for all tool behaviour
export interface ScgRuleset
{
	attributes: AttributeRuleset;
	background: BackgroundRuleset;
	skills: SkillRuleset;
	class: ClassRuleset;
	foci: FociRuleset;
	psychics: PsychicsRuleset;
}

// Default ruleset
export const defaultRules: ScgRuleset = {
	attributes: {
		attributes: [
			{
				name: "Strength",
				key: "str",
				description: "Physical prowess, melee combat, carrying gear, brute force."
			},
			{
				name: "Dexterity",
				key: "dex",
				description: "Speed, evasion, manual dexterity, reaction time, combat initiative."
			},
			{
				name: "Constitution",
				key: "con",
				description: "Hardiness, enduring injury, resisting toxins, going without food or sleep."
			},
			{
				name: "Intelligence",
				key: "int",
				description: "Memory, reasoning, technical skills, general education."
			},
			{
				name: "Wisdom",
				key: "wis",
				description: "Noticing things, making judgments, reading situations, intuition."
			},
			{
				name: "Charisma",
				key: "cha",
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
}

// Default character state (for testing)
export const defaultCharacter: Character = {
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
};