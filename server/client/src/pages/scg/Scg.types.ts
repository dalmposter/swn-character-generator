import React from "react";
import { Armour, Attribute, AttributeBonus, Background, Cyberware, Equipment, EquipmentPackage, Focus, PlayerClass,
	PsychicDiscipline, PsychicPower, Skill, Stim, Weapon } from "../../types/Object.types";
import { Character } from "./character.types";
import { defaultObjectContext } from "./default.types";
import { ScgRuleset } from "./ruleset.types";

export interface ScgProps {
	
}

export interface ScgState extends GameObjectsContext {
	ruleset: ScgRuleset;
	character: Character;
	operations: CharacterOperations;
	canPlusFoci: "any" | "combat" | "noncombat";
}

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
	foci: Map<number, Focus>;
	psychicDisciplines: Map<number, PsychicDiscipline>,
	psychicPowers: Map<number, PsychicPower>,
	items: {
		armours: Map<number, Armour>,
		cyberwares: Map<number, Cyberware>,
		equipments: Map<number, Equipment>,
		stims: Map<number, Stim>,
		weapons: Map<number, Weapon>,
	}
	equipmentPackages: Map<number, EquipmentPackage>,
}

export interface CharactersContext
{
	character: Character;
	operations: CharacterOperations;
}

export interface CharacterOperations
{
	attributes: {
		setValues: (newValues: Map<string, number>) => void;
		setBonusValues: (newBonuses: any) => void;
		setMode: (newMode: string) => void;
		setBonuses: (newBonuses: AttributeBonus[]) => void;
		incrementBonusValue: (attribute: Attribute) => void;
		decrementBonusValue: (attribute: Attribute) => void;
	},
	backgrounds: {
		setBackground: (backgroundId: number) => void;
		setQuick: (usingQuickSkills: boolean) => void;
		setRolledSkillIds: (rolledSkillIds: number[]) => void;
		setConfirmed: (confirmed: boolean, quickSkillIds: number[], freeSkillId: number) => void;
	},
	skills: {
		upSkill: (skillId: number) => void;
		downSkill: (skillId: number) => void;
		learnBonusSkill: (skillId: number) => void;
		removeBonusSkill: (skillId: number) => void;
	}
}

export const CharacterContext = React.createContext<CharactersContext>(undefined);

export const GameObjectContext = React.createContext<GameObjectsContext>(defaultObjectContext);

// TODO: when skills functionality is implemented, need object of functions to run on gaining system skills
export const systemSkillFunctions = {
}