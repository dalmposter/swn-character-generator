import { Skill, Background, Weapon, PsychicPower, Armour, Cyberware, Equipment, Focus, Stim, ClassDescription, Class } from "../../types/Object.types";

export interface WikiProps { };

export interface WikiState
{
	selectedCategory: string;
	skills: Skill[];
	backgrounds: Background[];
	weapons: Weapon[];
	"psychic-powers": PsychicPower[];
	armours: Armour[];
	cyberwares: Cyberware[];
	equipment: Equipment[];
	foci: Focus[];
	stims: Stim[];
	classes: Class[];
	"class-descriptions": ClassDescription[];
};

