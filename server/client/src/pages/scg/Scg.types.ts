import React from "react";
import { AttributeBonus, Background, ClassDescription, PlayerClass, Skill } from "../../types/Object.types";

export const GameObjectContext = React.createContext<GameObjectsContext>({
	backgrounds: [],
	skills: [],
	classes: [],
	classDescriptions: [],
});

export const CharacterContext = React.createContext<Character>({
	attributes: {
		values: new Map(),
		bonuses: [],
	}
});

export interface GameObjectsContext
{
	backgrounds?: Background[];
	skills?: Skill[];
	systemSkills?: Skill[];
	classes?: PlayerClass[];
	classDescriptions?: ClassDescription[];
}

export interface ScgProps {
	
}

export interface ScgState extends GameObjectsContext {
	ruleset?: ScgRuleset;
	character: Character;
}

export interface CharacterAttributes {
	values: Map<string,number>;
	mode?: string;
	bonuses: AttributeBonus[];
}

export interface CharacterBackground {
	value: number;
	quick?: boolean;
	growthRolls?: number[];
	learningRolls?: number[];
}

export interface EarntSkill
{
	level: number;
	spentPoints?: {
		any?: number;
		combat?: number;
		noncombat?: number;
	}
}

export interface CharacterSkills
{
	availablePoints: {
		any: number;
		combat: number;
		noncombat: number;
	};
	earntSkills: Map<number, EarntSkill>;
}

export interface CharacterClass
{
	classIds: number[];
}

export interface Character {
	attributes?: CharacterAttributes;
	background?: CharacterBackground;
	skills?: CharacterSkills;
	class?: CharacterClass;
}

export interface Attribute {
	name: string;
	key: string;
	description: string;
}

export type AttributeMode = RollMode | ArrayMode;

export interface RollMode {
	key: string;
	type: "roll" | "hybrid";
	dice: number;
	sides: number;
	fixedValues?: number[];
	startingValue: number;
}

export interface ArrayMode {
	key: string;
	type: "array";
	array: number[];
}

export interface AttributeRuleset {
	attributes: Attribute[];
	modes: AttributeMode[];
}

export interface BackgroundRuleset
{
	tableRolls: number;
}

export interface SkillRuleset {
	hobbies: number;
}

export interface ClassRuleset {
	multiCount: number;
}

export interface ScgRuleset {
	attributes: AttributeRuleset;
	background: BackgroundRuleset;
	skills: SkillRuleset;
	class: ClassRuleset
}

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
	}
}