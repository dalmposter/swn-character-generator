import React, { Component } from "react";
import { GameObjectContext, GameObjectsContext } from "../../../pages/scg/Scg.types";
import { findObjectInMap } from "../../../utility/GameObjectHelpers";
import "./itemAvatar.scss";

interface ItemAvatarProps
{
    type: string;
    id: number;
    quantity: number;
    size: "small" | "medium" | "large";
}

/**
 * 
 */
export default class ItemAvatar extends Component<ItemAvatarProps, {}>
{
    static contextType = GameObjectContext;
    context: GameObjectsContext;

    render() {
        if(this.context.items === undefined) return <p>loading...</p>
        var item = findObjectInMap(this.props.id, this.context.items[this.props.type]);
        //console.log("found", item, "in type", this.props.type, this.context.items[this.props.type])
        switch(this.props.size)
        {
            case "small":
                return(
                    <p className="Item Avatar">{ `${this.props.quantity}x ${item.name}` }</p>
                );
            case "medium":
                return (
                    <div className="Item Avatar">
                        <h3>{ `${this.props.quantity} x ${item.name}` }</h3>
                    </div>
                );
            case "large":
                return (
                    <div className="Item Avatar">
                        <h3>{ `${this.props.quantity} x ${item.name}` }</h3>
                    </div>
                );
        }
    }
}