import React, { useContext } from "react";
import { findObjectInMap } from "../../../../utility/GameObjectHelpers";
import { GameObjectContext } from "../../../scg/Scg.types";

interface SkillAvatarBaseProps
{
    id: number;
}

interface SkillAvatarProps extends SkillAvatarBaseProps
{
    size?: "small" | "large";
}

/**
 * Display info about 1 skill
 */
export default function SkillAvatar(props: SkillAvatarProps)
{
    switch(props.size)
    {
        case "small":
            return <SkillAvatarSmall {...props} />;
        case "large":
            return <SkillAvatarLarge {...props} />;
        default:
            return <SkillAvatarSmall {...props} />;
    }
}

function SkillAvatarSmall(props: SkillAvatarBaseProps)
{
    const skills = useContext(GameObjectContext).skills;
    var skill = findObjectInMap(props.id, skills);

    return (
        <div>
            <p>{skill? skill.name : `skill-${props.id}...`}</p>
        </div>
    );
}

function SkillAvatarLarge(props: SkillAvatarBaseProps)
{
    const skills = useContext(GameObjectContext).skills;
    var skill = findObjectInMap(props.id, skills);

    return (
        <div>
            <h3>{skill? skill.name : `skill-${props.id}...`}</h3>
        </div>
    );
}
