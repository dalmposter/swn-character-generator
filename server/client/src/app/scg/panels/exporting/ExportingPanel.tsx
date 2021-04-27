import React, { Component } from "react";
import { replacer } from "../../../../utility/JavascriptObjectHelpers";
import { CharacterContext } from "../../Scg.types";
import PanelHeader from "../components/PanelHeader";
import { ExportingPanelState, ExportingPanelProps } from "./ExportingPanel.types";
import { Button, Input, Panel, Uploader } from "rsuite";
import { FileType } from "rsuite/lib/Uploader";
import "./exportingPanel.scss";

/*
 *  Panel for saving and exporting character
 *  Currently serves as a viewport to see the character json
 */
export default class ExportingPanel extends Component<ExportingPanelProps, ExportingPanelState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    constructor(props)
    {
        super(props);

        this.state = {
            uploadedCharacter: undefined,
            uploadedRuleset: undefined,
        }
    }

    render() {
        return (
            <div className="Exporting Panel">
                <PanelHeader {...this.props} />
                <h1>Save/Export Character</h1>
                <div className="margin-8 flexbox">
                    <div className="flexbox column">
                        <div className="input-label">
                            <h2 className="input-label">
                            Character name:
                            </h2>
                        </div>
                        <div className="input-label">
                            <h2 className="input-label">
                            Player name:
                            </h2>
                        </div>
                    </div>
                    <div className="flex grow flexbox column"
                        style={{maxHeight: "max-content", marginLeft: "8px"}}
                    >
                        <Input style={{width: "-moz-available"}} className="margin-8"
                            size="lg" placeholder="Character Name"
                            value={this.context.character.name}
                            onChange={(value => this.context.operations.general.setName(value))}
                        />
                        <Input style={{width: "-moz-available"}} className="margin-8"
                            size="lg" placeholder="Player Name"
                            value={this.context.character.playerName}
                            onChange={(value => this.context.operations.general.setPlayerName(value))}
                        />
                    </div>
                </div>
                <div className="input-row">
                    <div className="input-container">
                        <Uploader
                            multiple={false}
                            fileList={this.state.uploadedCharacter
                                        ? [this.state.uploadedCharacter]
                                        : []
                            }
                            onChange={((fileList: FileType[]) => {
                                if(fileList.length > 0)
                                {
                                    this.setState({ uploadedCharacter: fileList[0] });
                                    this.context.operations.meta.loadFromFile(fileList[0]);
                                }
                                else this.setState({ uploadedCharacter: undefined });
                            })}
                            autoUpload={false}
                            fileListVisible={false}
                        >
                            <button className="rs-uploader-trigger-btn" type="button">
                                <span>Upload Character</span>
                                <span className="rs-ripple-pond">
                                    <span className="rs-ripple">
                                    </span>
                                </span>
                            </button>
                        </Uploader>
                    </div>
                    <div className="input-container">
                        <Button onClick={() => this.context.operations.meta.saveToFile()}>
                            Download Character
                        </Button>
                    </div>
                    <div className="input-container">
                        <Button onClick={() => this.context.operations.meta.generatePdf()}>
                            Generate PDF
                        </Button>
                    </div>
                    { false && <div className="input-container">
                        <Button onClick={() => this.context.operations.meta.saveToFile()}
                            disabled={true}
                        >
                            Export to Excel
                        </Button>
                    </div> }
                </div>
                <div className="input-row">
                    <div className="input-container">
                        <Uploader
                            multiple={false}
                            fileList={this.state.uploadedRuleset
                                        ? [this.state.uploadedRuleset]
                                        : []
                            }
                            onChange={((fileList: FileType[]) => {
                                if(fileList.length > 0)
                                {
                                    this.setState({ uploadedRuleset: fileList[0] });
                                    this.props.loadRuleset(fileList[0]);
                                }
                                else this.setState({ uploadedRuleset: undefined });
                            })}
                            autoUpload={false}
                            fileListVisible={false}
                        >
                            <button className="rs-uploader-trigger-btn" type="button">
                                <span>Upload Ruleset</span>
                                <span className="rs-ripple-pond">
                                    <span className="rs-ripple">
                                    </span>
                                </span>
                            </button>
                        </Uploader>
                    </div>
                    <div className="input-container">
                        <Button onClick={this.props.saveRuleset}>
                            Download Ruleset
                        </Button>
                    </div>
                    <div className="input-container">
                        <Button onClick={this.props.saveDefaultRuleset}>
                            Create Default Ruleset
                        </Button>
                    </div>
                </div>

                <Panel header={<h2>Character savefile preview</h2>}
                    collapsible bordered style={{borderColor: "black"}}
                >
                    <textarea
                        style={{width: "100%", height: "480px", marginTop: "-12px"}}
                        value={ JSON.stringify(this.context.character, replacer, 2) }
                        readOnly
                    />
                </Panel>
            </div>
        );
    }
}