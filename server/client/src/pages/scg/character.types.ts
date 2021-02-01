import { AttributeBonus } from "../../types/Object.types";

// Attributes section of a saved character
export interface CharacterAttributes {
	values: Map<string,number>;
	bonusValues: Map<string, number>;
	mode?: string;
	bonuses: AttributeBonus[];
	remainingBonuses: Map<string, number>;
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
	inventory?: CharacterInventory;
}

export interface CharacterInventory
{
	credits: number;
	armours?: Map<number, number>;
	cyberwares?: Map<number, number>;
	equipment?: Map<number, number>
	stims?: Map<number, number>;
	weapons?: Map<number, number>;
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