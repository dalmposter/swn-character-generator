import { Skill, Background, Weapon, PsychicPower, Armour, Cyberware, Equipment, Focus, Stim, ClassDescription, PlayerClass, EquipmentPackage } from "../../types/Object.types";

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
	equipments: Equipment[];
	foci: Focus[];
	stims: Stim[];
	classes: PlayerClass[];
	"class-descriptions": ClassDescription[];
	"equipment-packages": EquipmentPackage[];
};

