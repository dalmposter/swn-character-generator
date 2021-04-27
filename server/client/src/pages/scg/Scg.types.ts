import { PDFDocument } from "pdf-lib";
import React from "react";
import { FileType } from "rsuite/lib/Uploader";
import { Armour, Attribute, AttributeBonus, Background, Cyberware, Equipment, EquipmentPackage, Focus, PlayerClass,
	PsychicDiscipline, PsychicPower, Skill, Stim, Weapon } from "../../types/Object.types";
import { Character, CharacterExport, FocusPoints, FocusType } from "./character.types";
import { defaultObjectContext } from "./default.types";
import { ScgRuleset } from "./ruleset.types";

export interface ScgProps {
	
}

interface ActiveModal {
	header: React.ReactElement;
	body: React.ReactElement;
	footer?: React.ReactElement;
	onExit?: () => void;
	backdrop?: boolean | "static";
}

export interface ScgState extends GameObjectsContext {
	ruleset: ScgRuleset;
	character: Character;
	operations: CharacterOperations;
	canPlusFoci: "any" | "combat" | "noncombat";
	activeModal?: ActiveModal;
	queuedModals: ActiveModal[];
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
	};
	equipmentPackages: Map<number, EquipmentPackage>,
}

export interface CharactersContext
{
	character: Character;
	operations: CharacterOperations;
}

export interface AttributeOperations {
	getFinalValue?: (key: string) => number;
	calculateFinalValues?: () => void;
	setStat?: (key: string, newValue: number) => void;
	setMode?: (newMode: string) => void;
	setBonuses?: (newBonuses: AttributeBonus[]) => void;
	incrementBonusValue?: (attribute: Attribute) => void;
	decrementBonusValue?: (attribute: Attribute) => void;
	getModifier?: (key: string) => number;
}

export interface BackgroundOperations {
	setBackground?: (backgroundId: number) => void;
	setQuick?: (usingQuickSkills: boolean) => void;
	setRolledSkillIds?: (rolledSkillIds: number[]) => void;
	setConfirmed?: (confirmed: boolean, quickSkillIds: number[], freeSkillId: number) => void;
}

export interface SkillOperations {
	learnBonusSkill?: (skillId: number) => void;
	removeBonusSkill?: (skillId: number) => void;
	upSkill?: (skillId: number, spent?: { spentBonuses?: number, spentPoints?: number, skill?: number }) => void;
	downSkill?: (skillId: number, refunded?: { spentBonuses?: number, spentPoints?: number }) => void;
}

export interface ClassOperations {
	addClassId?: (classId: number) => void;
	removeClassId?: (classId: number) => void;
	confirmClass?: () => void;
	resetClass?: () => void;
}

export interface FociOperations {
	addFocus?: (focusId: number) => void;
	getCanPlusFoci?: (character?: Character) => FocusType;
	calculateCanPlus?: () => void;
	setAvailableFociPoints?: (newPoints: FocusPoints) => void;
	removeFocus?: (focusId: number) => void;
}

export interface PsychicOperations {
	upDiscipline?: (id: number) => void;
	downDiscipline?: (id: number) => void;
	removeDiscipline?: (id: number) => void;
	addPower?: (typeId: number, id: number) => void;
	removePower?: (typeId: number, id: number, forceRefundTechnique?: boolean, forceRefundAny?: boolean) => void;
}

export interface InventoryOperations {
	setPack?: (id: number) => void;
	addItem?: (id: number, type: string, amount: number) => void;
	removeItem?: (id: number, type: string, amount: number) => void;
	addCredits?: (amount: number) => void;
}

export interface GeneralOperations {
	rollHp?: () => void;
	calculateHp?: () => void;
	calculateAc?: () => void;
	calculateAttackBonus?: () => void;
	calculateSaves?: () => void;
	recaulculate?: () => void;
	levelUp?: () => void;
	setName?: (name: string) => void;
	setPlayerName?: (name: string) => void;
}

export interface MetaOperations {
	saveToFile?: () => void;
	repairCharacter?: (character: any) => Character;
	loadFromFile?: (file: FileType) => void;
	generatePdf?: () => Promise<PDFDocument>;
}

export interface CharacterOperations
{
	general: GeneralOperations;
	attributes: AttributeOperations;
	backgrounds: BackgroundOperations;
	skills: SkillOperations;
	classes: ClassOperations;
	foci: FociOperations;
	psychics: PsychicOperations;
	inventory: InventoryOperations;
	meta: MetaOperations;
}

export const CharacterContext = React.createContext<CharactersContext>(undefined);

export const GameObjectContext = React.createContext<GameObjectsContext>(defaultObjectContext);

export type FormMapMaker = [string, (c: CharacterExport) => string];