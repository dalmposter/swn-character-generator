export interface ScgProps {
	
}

export interface ScgState {
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

export interface AttributeRuleset {
	attributes: Attribute[];
	array: number[];
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
		array: [14, 12, 12, 10, 9, 7]
	}
}