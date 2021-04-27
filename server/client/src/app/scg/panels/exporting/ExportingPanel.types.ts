import { FileType } from "rsuite/lib/Uploader";
import { PanelProps } from "../panels.types";

export interface ExportingPanelProps extends PanelProps
{
    saveRuleset: () => void;
    saveDefaultRuleset: () => void;
    loadRuleset: (file: FileType) => void;
}

export interface ExportingPanelState
{
    uploadedCharacter: FileType;
    uploadedRuleset: FileType;
}