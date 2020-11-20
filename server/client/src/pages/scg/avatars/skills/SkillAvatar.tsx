import React, { useContext } from "react";
import { defaultMaxListeners } from "stream";
import { ErrorBoundary } from "../../../../components/ErrorBoundary";
import { Skill } from "../../../../types/Object.types";
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
    var skill;
    if(skills) skill = skills.find((skill: Skill) => skill.id == props.id);

    return (
        <div>
            <p>{skill? skill.name : `skill-${props.id}...`}</p>
        </div>
    );
}

function SkillAvatarLarge(props: SkillAvatarBaseProps)
{
    const skills = useContext(GameObjectContext).skills;
    var skill;
    if(skills) skill = skills.find((skill: Skill) => skill.id == props.id);

    return (
        <div>
            <h3>{skill? skill.name : `skill-${props.id}...`}</h3>
        </div>
    );
}
