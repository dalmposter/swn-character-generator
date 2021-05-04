import React, { useContext, useState } from "react";
import { Button, Checkbox, Modal, Panel } from "rsuite";
import { GameObjectContext } from "../../../scg/Scg.types";
import { PsychicPower } from "../../../../types/object.types";
import { findObjectInMap } from "../../../../utility/GameObjectHelpers";
import "./psychicPowerAvatar.scss";
import "rsuite/lib/styles/index.less";

export type PsychicPowerAvatarProps = PsychicPowerInteractableAvatarProps
    | PsychicPowerNonInteractableAvatarProps;

export interface PsychicPowerAvatarCommonProps {
    id: number;
    className?: string;
    owned?: boolean;
    unavailable?: boolean;
    disabled?: boolean;
    locked?: boolean;
    addPower?: () => void;
    removePower?: () => void;
}

export interface PsychicPowerInteractableAvatarProps extends PsychicPowerAvatarCommonProps {
    isCore?: boolean;
    nonInteractable?: false;
}

export interface PsychicPowerNonInteractableAvatarProps extends PsychicPowerAvatarCommonProps {
    nonInteractable: true;
    isCore?: false;
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
        <div className="flexbox" style={{marginRight: "36px"}}>
            <h3 className="flex grow no-margin">{`${power.name} - core skill`}</h3>
            <h3 className="no-margin"><i>{makeCost()}</i></h3>
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
    if(props.isCore) return (
        <Panel header={ makeCoreHeader() }
            collapsible bordered
            style={{ borderColor: "black" }}
            className={`Psychic Avatar Owned ${props.className? ` ${props.className}` : ""}`}
        >
            <p style={{marginTop: "-12px"}}>
                {power.description}
            </p>
        </Panel>
    );

    return (<>
    <label style={{display: "table", height: "100%", width: "100%"}}>
        <div className={`Psychic Avatar Power ${
            props.className? ` ${props.className}` : ""}` +
            (props.nonInteractable
            ? " Locked"
            : `
                ${props.owned === true? " Owned" : props.owned === false? " Unowned" : ""}
                ${props.unavailable && !props.owned? " Unavailable" : ""}
                ${props.locked? " Locked" : ""}`)
            }
        >
            { // Render selector if this is part of the psychic panel
            props.owned != null &&
                    <Checkbox
                        style={{position: "absolute", top: 4, right: 4}}
                        checked={props.owned}
                        disabled={((props.unavailable || props.disabled) && !props.owned)
                            || (props.owned && props.unavailable)}
                        onChange={
                            Object.keys(props).includes("nonInteractable")
                                ? undefined
                                : props.owned
                                    ? props.removePower
                                    : props.addPower
                        }
                    />
            }

            <Button size="xs"
                className="info-button"
                style={{position: "absolute", top: 4, left: 4}}
                onClick={ () => setInspecting(true) }
            >
                <b>?</b>
            </Button>

            <div className="Name"><h4>{ power.name }</h4></div>
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
    </>);
}