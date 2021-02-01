import React from "react";
import { Armour, Attribute, AttributeBonus, Background, ClassDescription, Cyberware, Equipment, EquipmentPackage, Focus, PlayerClass,
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
	classDescriptions: Map<number, ClassDescription>;
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
		setBonusValues: (newBonuses: Map<string, number>) => void;
		setMode: (newMode: string) => void;
		setBonuses: (newBonuses: AttributeBonus[]) => void;
		incrementBonusValue: (attribute: Attribute) => void;
		decrementBonusValue: (attribute: Attribute) => void;
	}
}

export const CharacterContext = React.createContext<CharactersContext>(undefined);

export const GameObjectContext = React.createContext<GameObjectsContext>(defaultObjectContext);