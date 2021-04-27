import { AttributeBonus, ClassDescription } from "../../types/Object.types";

// Attributes section of a saved character
export interface CharacterAttributes
{
	rolledValues: Map<string,number>;
	bonusValues: Map<string, number>;
	finalValues: Map<string, number>;
	mode?: string;
	bonuses: AttributeBonus[];
	remainingBonuses: {
		any: number;
		physical: number;
		mental: number;
	};
}

// Backgrounds section of a saved character
export interface CharacterBackground
{
	id: number;
	name: string;
	quick: boolean;
	rolledSkillIds: number[];
	confirmed: boolean;
}

// Represents 1 skill having been earnt to any level
export interface EarntSkill
{
	level: number;
	skillSources: number[];
	spentPoints: number;
	spentBonuses: number;
}

export interface SkillPoints
{
	any: number;
	psychic: number;
	combat: number;
	noncombat: number;
}

// Skills section of a saved character
export interface CharacterSkills
{
	availableBonuses: SkillPoints;
	spentBonuses: SkillPoints;
	anySpentOnPsychics: number;
	skillPoints: number;
	earntSkills: Map<number, EarntSkill>;
}

// Class section of a saved character
export interface CharacterClass
{
	classIds: Set<number>;
	confirmed: boolean;
	finalClass?: ClassDescription;
}

// A saved character
export interface Character
{
	playerName: string;
	name: string;
	attributes?: CharacterAttributes;
	background?: CharacterBackground;
	skills?: CharacterSkills;
	class?: CharacterClass;
	foci?: CharacterFoci;
	psychics?: Map<number, CharacterPsychic>;
	inventory?: CharacterInventory;
	saves: {
		physical: number;
		evasion: number;
		mental: number;
	}
	level: number;
	xp: number;
	rolledHp: number;
	finalHp: number;
	attackBonus: number;
	ac: number;
}

export interface CharacterExportAttributes extends CharacterAttributes
{
	modifiers?: Map<string, number>;
	finalValues: Map<string, number>;
}

export interface CharacterExportInventory extends CharacterInventory
{
	mainWeapons?: number[];
	mainArmours?: number[];
	mainCyberwares?: number[];
}

export interface CharacterExport extends Character
{
	// Override default attributes section to include on with final values calculated
	attributes?: CharacterExportAttributes;
	allPsychicTechniqueIds?: number[];
	inventory?: CharacterExportInventory
}

export interface CharacterInventory
{
	credits: number;
	equipmentPackageId?: number;
	armours?: Map<number, number>;
	cyberwares?: Map<number, number>;
	equipments?: Map<number, number>
	stims?: Map<number, number>;
	weapons?: Map<number, number>;
}

export interface CharacterPsychic
{
	level: number;
	knownTechniques: number[]; // Map of discipline level to known techniques in that level
	freePicks: number;
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
	canPlus: FocusType;
}

export type FocusType = "combat" | "noncombat" | "any" | null;