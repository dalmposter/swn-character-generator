import React from "react";
import { Background, Skill } from "../../types/Object.types";
import { BackgroundsPanel } from "./panels/backgrounds/BackgroundsPanel";

export const GameObjectContext = React.createContext<GameObjectsContext>({
	backgrounds: [],
	skills: [],
});

export interface GameObjectsContext
{
	backgrounds?: Background[];
	skills?: Skill[];
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
	bonuses: any;
}

export interface Character {
	attributes?: CharacterAttributes;
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

export interface ScgRuleset {
	attributes: AttributeRuleset;
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
	}
}