import React, { useContext } from "react";
import { ErrorBoundary } from "../../../../components/ErrorBoundary";
import { Background, Skill } from "../../../../types/Object.types";
import { GameObjectContext } from "../../Scg.types";
import SkillAvatar from "../skills/SkillAvatar";

interface BackgroundAvatarProps
{
    size?: "small" | "medium" | "large";
    id: number;
}

function BackgroundAvatarSmall(props: BackgroundAvatarProps)
{
    const gameObjects = useContext(GameObjectContext);
    const background = gameObjects.backgrounds.find(
        (value: Background) => value.id === props.id );

    return (
    <div>
        <h3>{ background.name }</h3>
        { [background.free_skill_id, ...background.quick_skill_ids].map((skillId: number) =>
            <SkillAvatar id={skillId} />
        ) }
    </div>
    );
}

function BackgroundAvatarMedium(props: BackgroundAvatarProps)
{
    const gameObjects = useContext(GameObjectContext);
    const background = gameObjects.backgrounds.find(
        (value: Background) => value.id === props.id );

    return (
    <div>
        <h3>{ background.name }</h3>
        { background.quick_skill_ids.map((skillId: number) =>
            <SkillAvatar id={skillId} />
        ) }
    </div>
    );
}

function BackgroundAvatarLarge(props: BackgroundAvatarProps)
{
    const background = useContext(GameObjectContext).backgrounds.find(
        (value: Background) => value.id === props.id );

    return (
    <div>
        <h3>{ background.name }</h3>
    </div>
    );
}

export function BackgroundAvatar(props: BackgroundAvatarProps)
{
    switch(props.size)
    {
        case "small":
            return <BackgroundAvatarSmall {...props} />;
        case "medium":
            return <BackgroundAvatarMedium {...props} />;
        case "large":
            return <BackgroundAvatarLarge {...props} />;
        default:
            return <BackgroundAvatarMedium {...props} />;
    }
}
