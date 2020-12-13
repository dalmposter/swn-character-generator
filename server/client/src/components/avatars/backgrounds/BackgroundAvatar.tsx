import React, { useContext, useState } from "react";
import { Background, Skill } from "../../../types/Object.types";
import { findObjectInMap, findObjectsInMap } from "../../../utility/GameObjectHelpers";
import { GameObjectContext, GameObjectsContext } from "../../../pages/scg/Scg.types";
import "./backgroundAvatar.scss";
import { BackgroundAvatarProps, BackgroundAvatarSmallProps, BackgroundAvatarMLCommonProps, BackgroundAvatarMediumProps, BackgroundAvatarLargeProps } from "./BackgroundAvatar.types";

function backgroundAvatarInit(props: BackgroundAvatarProps, gameObjects: GameObjectsContext)
{
    const background: Background = findObjectInMap(props.id, gameObjects.backgrounds);
    const freeSkill: Skill = findObjectInMap(background.free_skill_id, gameObjects.skills);
    const quickSkills: Skill[] = findObjectsInMap(background.quick_skill_ids, gameObjects.skills);
    
    return {background, freeSkill, quickSkills};
}

/**
 * Smallest render of a background. Name and free and quick skills
 * Optionally includes input for choosing the background
 */
function BackgroundAvatarSmall(props: BackgroundAvatarSmallProps)
{
    const gameObjects = useContext(GameObjectContext);
    const {background, freeSkill, quickSkills} = backgroundAvatarInit(props, gameObjects);

    return (
    <div className="Background Avatar Small" style={props.style}>
        <div className="flex grow">
            <h3>{ background.name }</h3>
            <p>{ `Free: ${freeSkill.name}` }</p>
            <p>{ `Quick: ${quickSkills.map((skill: Skill) => skill.name).join(",  ")}` }</p>
        </div>
        <div className="flex">
            <button className="button tiny"
                onClick={() => console.log("background description: ", background.description)}>
                i
            </button>
            { props.onAdd &&
                // Render choose background button if function given
                <button className="button tiny"
                    onClick={props.onAdd}>
                    +
                </button>
            }
        </div>
    </div>
    );
}

function BackgroundAvatarMLCommon(props: BackgroundAvatarMLCommonProps)
{
    const gameObjects = useContext(GameObjectContext);
    const {background, freeSkill, quickSkills} = backgroundAvatarInit(props, gameObjects);

    return (
        <>
        <h2>{ background.name }</h2>
        <div style={{overflowY: "auto", maxHeight: props.descriptionMaxHeight}}>
            <p>{ background.description }</p>
        </div>
        <div className="flexbox">
            <div className="flex grow no-margins">
                <h4>{ `Free Skill:` }</h4>
                <p>{freeSkill.name}</p>
            </div>
            <div className="flex grow no-margins">
                <h4>{ `Quick Skills:` }</h4>
                <p>{quickSkills.map((skill: Skill) => skill.name).join(",  ")}</p>
            </div>
        </div>
        <div className="flexbox">
            <div className="flex grow">
                <table>
                    <thead>
                        <tr>
                            <th>d6</th>
                            <th>Growth</th>
                        </tr>
                    </thead>
                    <tbody>
                    {   findObjectsInMap(
                            background.growth_skill_ids,
                            gameObjects.skills,
                            gameObjects.systemSkills
                        ).map((skill: Skill, index: number) => 
                        <tr key={`${index}-${skill}`}>
                            <td>{index+1}</td>
                            <td>{skill.name}</td>
                        </tr> )
                    }
                    </tbody>
                </table>
            </div>
            <div className="flex grow">
                <table>
                    <thead>
                        <tr>
                            <th>d8</th>
                            <th>Learning</th>
                        </tr>
                    </thead>
                    <tbody>
                    {   findObjectsInMap(
                            background.learning_skill_ids,
                            gameObjects.skills,
                            gameObjects.systemSkills
                        ).map((skill: Skill, index: number) => 
                        <tr key={`${index}-${skill}`}>
                            <td>{index+1}</td>
                            <td>{skill.name}</td>
                        </tr> )
                    }
                    </tbody>
                </table>
            </div>
        </div>
        </>
        );
}

function BackgroundAvatarMedium(props: BackgroundAvatarMediumProps)
{

    return (
        <div className="Background Avatar Large flexbox" style={{...props.style, flexDirection: "column"}}>
            <BackgroundAvatarMLCommon {...props} />
        </div>
    );
}

/**
 * Full render of a background, including interactable roll tables
 */
function BackgroundAvatarLarge(props: BackgroundAvatarLargeProps)
{
    const [growthCount, setGrowthCount] = useState(0);
    const [isRolling, setRolling] = useState(false);

    const gameObjects = useContext(GameObjectContext);
    const {quickSkills} = backgroundAvatarInit(props, gameObjects);

    return (
        <div className="Background Avatar Large flexbox"
            style={{...props.style, flexDirection: "column"}}
            ref={props.onRef}
        >
            <BackgroundAvatarMLCommon {...props} />
            <h3>Choose Background Skills</h3>
            <div className="flexbox column"
                onChange={(event: any) => setRolling(event.target.value === "roll")}
            >
                <div className="flex grow flexbox">
                    <div className="flex grow" style={{flex: "0.5"}}>
                        <label>
                            <input type="radio" defaultChecked={true} value="quick" name="rollOrQuick"/>
                            Use Quick Skills
                        </label>
                    </div>
                    <div className="flex grow no-margins">
                        <p className={isRolling? "off" : "on"}>{`You gain: ${quickSkills.map((skill: Skill) => skill.name).join(",  ")}`}</p>
                    </div>
                </div>
                <div className="flex grow no-margins" style={{ margin: "4px" }}>
                    <h4>OR</h4>
                </div>
                <div className="flex grow flexbox">
                    <div className="flex grow" style={{flex: "0.5"}}>
                        <label>
                            <input type="radio" value="roll" name="rollOrQuick"/>
                            Roll on Tables
                        </label>
                    </div>
                    <div className={"flex grow no-margins flexbox" + (isRolling? " on" : " off")}>
                        <div className="flex grow flexbox no-margins">
                            <p>{`Growth:`}</p>
                            <input type="number"
                                disabled={!isRolling}
                                value={growthCount}
                                className="tiny"
                                onChange={(event: any) => setGrowthCount(Math.max(event.currentTarget.value, 0))}/>
                        </div>
                        <div className="flex grow flexbox no-margins">
                            <p>{`Learning:`}</p>
                            <input type="number"
                                disabled={!isRolling}
                                value={props.tableRolls - growthCount}
                                className="tiny"
                                onChange={(event: any) => setGrowthCount(Math.max(props.tableRolls - event.currentTarget.value, 0)) }/>
                        </div>
                        <div className="flex no-margins" style={{textAlign: "right"}}>
                            <button disabled={!isRolling}>Roll</button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        );
}

/**
 * Represents 1 background.
 * Allows various sizes of avatar so is actually a switch mapping size to another component
 * Takes ID and fetches the background to render
 */
export function BackgroundAvatar(props: BackgroundAvatarProps)
{
    const gameObjects = useContext(GameObjectContext);

    // Current simple error handling. If the backgrounds aren't loaded, don't try to render an avatar
    if(gameObjects.backgrounds.size === 0)
    {
        return <div></div>;
    }

    switch(props.size)
    {
        case "small":
            return <BackgroundAvatarSmall {...props} />;
        case "large":
            return <BackgroundAvatarLarge {...props} />;
        default:
            return <BackgroundAvatarMedium {...props} />;
    }
}
