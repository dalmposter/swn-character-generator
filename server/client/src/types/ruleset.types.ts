import { Attribute } from "./object.types";

// Customisation object for attribute rolling behaviour
export type AttributeMode = {
	key: string;
	type: "roll" | "hybrid" | "array";
	dice?: number;
	sides?: number;
	fixedValues?: number[];
	startingValue?: number;
	array?: number[];
};

// Customisation object for attribute behaviour
export interface AttributeRuleset {
    attributes: Attribute[];
	modes: AttributeMode[];
	modifiers: Map<number, number>;
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
	initialCount: number;
}

export interface PsychicsRuleset
{
	canSpendBonusAnySkill: boolean;
}

export interface EquipmentRuleset
{
	// Starting credits obtained by rolling x y-sided die and multiplying by some multiplier
	startingCredits: {
		numberDice: number,
		numberSides: number,
		multiplier: number,
	}
}

export interface GeneralRuleset
{
	baseAC: number;
	baseAttackBonus: number;
	baseSave: number;
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
	equipment: EquipmentRuleset;
	general: GeneralRuleset
}