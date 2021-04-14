import React, { useContext, useState } from "react";
import { Button, Checkbox, Modal, Panel } from "rsuite";
import { GameObjectContext } from "../../../pages/scg/Scg.types";
import { PsychicPower } from "../../../types/Object.types";
import { findObjectInMap } from "../../../utility/GameObjectHelpers";
import Rsuite from "../Rsuite";
import "./psychicPowerAvatar.scss";
import "rsuite/lib/styles/index.less";

export interface PsychicPowerAvatarProps
{
    id: number;
    isCore?: boolean;
    owned?: boolean;
    unavailable?: boolean;
    locked?: boolean;
    disabled?: boolean;
    addPower?: () => void;
    removePower?: () => void;
    className?: string;
}

/**
 * Avatar for 1 psychic power within a discipline.
 * Takes an ID and some metadata and fetches power to render
 */
export default function PsychicPowerAvatar(props: PsychicPowerAvatarProps)
{
    const gameObjects = useContext(GameObjectContext);
    const power: PsychicPower = findObjectInMap(props.id,
        gameObjects.psychicPowers);
    
    const [isInspecting, setInspecting] = useState(false);

    const makeCoreHeader = () =>
        <div className="flexbox">
            <h5 className="flex grow">{`${power.name} - core skill`}</h5>
            <div className="flex grow"
                style={{textAlign: "right", marginTop: "auto", marginRight: "36px"}}
            >
                <h5><i>{makeCost()}</i></h5>
            </div>
        </div>
    
    const makeCost = () =>
        `Cost: ` + (power.commit_effort.length === 2
        ? `${power.commit_effort[0]} effort for the ${{
                'D': "day",
                'E': "encounter",
                '~': "duration of the power"
            }[power.commit_effort[1]]}`
        : `${power.commit_effort} effort`)

    // Different avatar for core and non-core skills
    return props.isCore
    ? (
        <Rsuite>
        <Panel header={ makeCoreHeader() }
            collapsible bordered
            style={{ borderColor: "black" }}
            className={`Psychic Avatar ${props.className? ` ${props.className}` : ""}`}
        >
            <p style={{marginTop: "-12px"}}>
                {power.description}
            </p>
        </Panel>
        </Rsuite>
    ) : (
        <>
        <label>
            <div className={`Psychic Avatar Power padding-4
                ${props.className? ` ${props.className}` : ""}
                ${props.owned === true? " Owned" : props.owned === false? " Unowned" : ""}
                ${props.unavailable && !props.owned? " Unavailable" : ""}
                ${props.locked? " Locked" : ""}`}
            >
                { // Render selector if this is part of the psychic panel
                props.owned != null &&
                    <Rsuite style={{float: "right"}}>
                        <Checkbox
                            checked={props.owned}
                            disabled={((props.unavailable || props.disabled) && !props.owned)
                                || (props.owned && props.unavailable)}
                            onChange={
                                props.owned
                                ? props.removePower
                                : props.addPower
                            }
                        />
                    </Rsuite>
                }

                <Rsuite>
                    <Button size="xs"
                        style={{backgroundColor: "#17a2b8", color: "white"}}
                        onClick={ () => setInspecting(true) }
                    >
                        <b>?</b>
                    </Button>
                </Rsuite>

                <h4 style={{textAlign: "center", marginTop: 0}}>{ power.name }</h4>
            </div>
        </label>

        <Modal show={isInspecting}
            onHide={() => setInspecting(false)}
        >
            <Modal.Header>
                <Modal.Title>{ power.name }</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{paddingBottom: "16px"}}>
                <p>{ power.description }</p>
                <p>
                    { makeCost() }
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setInspecting(false)}
                    appearance="primary"
                >
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}