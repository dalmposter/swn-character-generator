import { Skill, Background, Weapon } from "../../types/Object.types";

export interface WikiProps { };

export interface WikiState
{
	selectedCategory: string;
	skills?: Skill[];
	backgrounds?: Background[];
	weapons?: Weapon[];
};

