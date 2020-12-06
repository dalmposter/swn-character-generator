import React, { useContext } from "react";
import { GameObjectContext } from "../../../pages/scg/Scg.types";

export interface PsychicPowerAvatarProps
{
    id: number;
}

export default function PsychicPowerAvatar(props: PsychicPowerAvatarProps)
{
    const gameObjects = useContext(GameObjectContext);
    
    return (
        <div>
            
        </div>
    );
}