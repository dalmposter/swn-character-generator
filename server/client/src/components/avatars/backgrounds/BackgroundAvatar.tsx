import React, { useContext, useEffect, useState } from "react";
import { Background, Skill } from "../../../types/Object.types";
import { findObjectInMap, findObjectsInMap } from "../../../utility/GameObjectHelpers";
import { GameObjectContext, GameObjectsContext } from "../../../pages/scg/Scg.types";
import "./backgroundAvatar.scss";
import { BackgroundAvatarProps, BackgroundAvatarSmallProps, BackgroundAvatarMediumProps, BackgroundAvatarLargeProps } from "./BackgroundAvatar.types";
import './react-tabs.scss';
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

function backgroundAvatarInit(props: BackgroundAvatarProps, gameObjects: GameObjectsContext)
{
    const background: Background = findObjectInMap(props.id, gameObjects.backgrounds);
    const freeSkill: Skill = findObjectInMap(background.free_skill_id, gameObjects.skills, gameObjects.systemSkills);
    const quickSkills: Skill[] = findObjectsInMap(background.quick_skill_ids, true, gameObjects.skills, gameObjects.systemSkills);
    
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
                onClick={props.onInspect}>
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

function BackgroundAvatarMedium(props: BackgroundAvatarMediumProps)
{

    return (
        <div className="Background Avatar Large flexbox" style={{...props.style, flexDirection: "column"}}>
            <h3>Medium incomplete</h3>
        </div>
    );
}

/**
 * Full render of a background, including interactable roll tables
 */
function BackgroundAvatarLarge(props: BackgroundAvatarLargeProps)
{
    const [growthCount, setGrowthCountState] = useState(0);

    const gameObjects = useContext(GameObjectContext);
    const {background, freeSkill, quickSkills} = backgroundAvatarInit(props, gameObjects);
    const [ref, setRef] = useState<any>();

    useEffect(() => {
        if(ref && props.currentHeight !== ref.clientHeight)
            props.setHeight(ref.clientHeight);
    });

    const setGrowthCount = (newCount: number) =>
    {
        if(newCount < 0 || props.tableRolls - newCount < 0) return;
        setGrowthCountState(newCount);
    }

    const rollSkills = () => {
        let out = [];
        for(let i = 0; i < growthCount; i++)
        {
            out.push(background.growth_skill_ids[Math.floor(Math.random() * 6)]);
        }
        for(let i = 0; i < props.tableRolls - growthCount; i++)
        {
            out.push(background.learning_skill_ids[Math.floor(Math.random() * 6)]);
        }
        props.setRolledSkillIds(out);
    }

    return (
    <div className="Background Avatar Large flexbox"
        style={{...props.style, flexDirection: "column"}}
        ref={newRef => setRef(newRef)}
    >
        <div>
            <h2 style={{float: "left"}}>{ background.name }</h2>
            { // If we are given a function to set shownDesc, render button to toggle it
                props.setShownDesc &&
                <button style={{float: "right"}}
                    onClick={() => props.setShownDesc(!props.shownDesc)}
                >
                    { props.shownDesc? "Hide Description" : "Show Description" }
                </button>
            }
        </div>
        { props.shownDesc &&
            <div style={{overflowY: "auto", maxHeight: props.descriptionMaxHeight, marginTop: "0"}}>
                <p>{ background.description }</p>
            </div>
        }
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
                            true,
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
                            true,
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
        <h3>Choose Background Skills</h3>
        {/* onSelect: set whether the player is viewing the quick or roll skills tab */}
        <Tabs onSelect={(index) => { props.setQuick(index === 0) }}
            selectedTabClassName="Selected"
            style={{marginTop: "0", marginBottom: "0"}}
        >
            <TabList style={{background: "inherit", borderColor: "darkslategrey", margin: "0"}}>
                <Tab disabled={props.confirmed} className="BackgroundTab">
                    Quick Skills
                </Tab>
                <Tab disabled={props.confirmed} className="BackgroundTab">
                    Roll Skills
                </Tab>
            </TabList>
            <div style={{padding: "16px", margin: "0", borderColor: "darkslategrey", border: "1px solid", borderTop: "0"}}>
                <TabPanel className="BackgroundTabPanel">
                    <p style={{marginTop: "0", marginBottom: "0"}}>
                        {`You gain `}
                        <b>{quickSkills.map((skill: Skill) => skill.name).join(", ")}</b>
                        {` as bonus skills`}
                    </p>
                </TabPanel>
                <TabPanel className="BackgroundTabPanel">
                { (props.rolledSkillIds.length > 0 || props.confirmed)?
                    <p style={{marginTop: "0", marginBottom: "0"}}>
                        {`You gain `}
                        <b>
                        {findObjectsInMap(props.rolledSkillIds, true, gameObjects.skills, gameObjects.systemSkills)
                        .map((value: Skill) => value.name).join(", ")}
                        </b>
                        {` as bonus skills`}
                    </p>
                    :
                    <div className="flex grow flexbox">
                        <div className="flex grow flexbox no-margins">
                            <p>{`Growth:`}</p>
                            <input type="number"
                                value={growthCount}
                                className="tiny"
                                onChange={(event: any) => setGrowthCount(event.currentTarget.value)}/>
                        </div>
                        <div className="flex grow flexbox no-margins">
                            <p>{`Learning:`}</p>
                            <input type="number"
                                value={props.tableRolls - growthCount}
                                className="tiny"
                                onChange={(event: any) => setGrowthCount(props.tableRolls - event.currentTarget.value) }/>
                        </div>
                        <div className="flex no-margins" style={{textAlign: "right"}}>
                            <button disabled={props.isQuick} onClick={() => {
                                rollSkills();
                                props.setConfirmed(background.quick_skill_ids, background.free_skill_id);
                            }}>
                                Roll
                            </button>
                        </div>
                    </div>
                }
                </TabPanel>
            </div>
        </Tabs>
        { props.confirmed ?
            <h3 style={{color: "darkgreen"}}>
                Skills and bonuses applied
            </h3>
            :
            <button style={{maxWidth: "140px"}}
                onClick={() => {
                    // If the player is on the roll tab and has not rolled yet, do the roll before confirming
                    if(!props.isQuick && props.rolledSkillIds.length === 0)
                    {
                        rollSkills();
                    }
                    props.setConfirmed(background.quick_skill_ids, background.free_skill_id);
                }}
            >
                Confirm Selection
            </button>
        }
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
