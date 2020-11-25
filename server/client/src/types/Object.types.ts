export interface GameObject
{
	id: number;
	name: string;
	source_id: number;
	page: number;
}


export interface Skill extends GameObject
{
	description: string;
	system: boolean;
	is_combat: boolean;
};

export interface PlayerClass extends GameObject
{
	full_class_id: number;
	partial_class_id: number;
	reserved: boolean;
}

export interface ClassBonuses
{
	skills: number[];
	attack_bonus: number;
	hp: number;
	foci: {
		combat: number;
		non_combat: number;
		any: number;
	};
}

export interface LevelClassBonuses extends ClassBonuses
{
	levels: number[];
}

export interface ClassDescription extends GameObject
{
	description: string;
	bonuses: ClassBonuses;
	level_up_bonuses: ClassBonuses;
	specific_level_bonuses: LevelClassBonuses;
	hit_die: string;
	ability_descriptions: string[];
}

export interface Background extends GameObject
{
	description: string;
	short_description_start_index: number;
	free_skill_id: number;
	quick_skill_ids: number[];
	growth_skill_ids: number[];
	learning_skill_ids: number[];
}

export interface Weapon extends GameObject
{
	attribute: string;
	damage: string;
	shock: string;
	range_low: number;
	range_high: number;
	magazine: number;
	encumbrance: number;
	tech_level: number;
	cost: number;
}

export interface PsychicPower extends GameObject
{
	level: number;
	commit_effort: string;
	type: string;
	description: string;
}

export interface Armour extends GameObject
{
	subtype: string;
	armour_class: number;
	carry_mod: number;
	tech_level: number;
	encumbrance: number;
	cost: number;
	description: string;
}

export interface Cyberware extends GameObject
{
	tech_level: number;
	system_strain: number;
	cost: number;
	description: string;
}

export interface Equipment extends GameObject
{
	tech_level: number;
	encumbrance: number;
	cost: number;
	category: string;
}

export interface Focus extends GameObject
{
	level_1_description: string;
	level_1_skill_id: number;
	level_2_description: string;
	is_combat: boolean;
}

export interface Stim extends GameObject
{
	heal_skill: number;
	system_strain: number;
}

export interface AttributeBonus
{
	skillId: number;
	name: string;
	description: string;
	type: "physical" | "mental" | "any";
	maxBonus: number;
	remainingBonus: number;
}