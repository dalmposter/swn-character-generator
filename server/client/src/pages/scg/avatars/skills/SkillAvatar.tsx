import React, { useContext } from "react";
import { findById, findObjectInList } from "../../../../utility/GameObjectHelpers";
import { GameObjectContext } from "../../Scg.types";

interface SkillAvatarBaseProps
{
    id: number;
}

interface SkillAvatarProps extends SkillAvatarBaseProps
{
    size?: "small" | "large";
}

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
    var skill = findObjectInList(skills,findById(props.id));

    return (
        <div>
            <p>{skill? skill.name : `skill-${props.id}...`}</p>
        </div>
    );
}

function SkillAvatarLarge(props: SkillAvatarBaseProps)
{
    const skills = useContext(GameObjectContext).skills;
    var skill = findObjectInList(skills,findById(props.id));

    return (
        <div>
            <h3>{skill? skill.name : `skill-${props.id}...`}</h3>
        </div>
    );
}
