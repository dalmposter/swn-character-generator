
export interface Skill
{
	id: number;
	name: string;
	description: string;
	source_id: number;
};

export interface Background
{
	id: number;
	name: string;
	desription: string;
	free_skill_id: number;
	quick_skill_ids: number[];
	growth_skill_ids: number[];
	learning_skill_ids: number[];
	source_id: number;
}

export interface Weapon
{
	id: number;
	name: string;
}