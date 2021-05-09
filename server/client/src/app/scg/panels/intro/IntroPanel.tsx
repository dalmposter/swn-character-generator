import React, { Component } from "react";
import { IntroPanelProps, IntroPanelState } from "./IntroPanel.types"
import "./introPanel.scss";
import { CharacterContext } from "../../Scg.types";
import PanelFrame from "../panel/PanelFrame";
import { Message } from "rsuite";

/**
 * Render an introductory panel explaining the tool
 */
export default class IntroPanel extends Component<IntroPanelProps, IntroPanelState>
{
    static contextType = CharacterContext;
    context: React.ContextType<typeof CharacterContext>;

    introLong = "If Stars  Without  Number  is  your  first  tabletop  role-playing  game,  you’re  a  rare  soul.  Most  of  the  readers  of  this  book  will  already  be  familiar  with the hobby, but fear not; tabletop RPGs aren’t hard  to  understand.  Just  think  of  them  as  a  pen-cil-and-paper equivalent of a computer RPG, with a “game master” or “GM” in place of the computer, and 2-5 players playing “player character” avatars.You’ll  need  paper,  pencils,  and  a  set  of  poly-hedral  dice  or  a  dice  app  to  play  the  game.  You  can get gaming dice online easily. When the book tells  you  to  roll  “2d10+1”,  for  example,  it  means  to roll two ten-sided dice and add them together, then add one to the result. “d00” means to roll two 10-sided dice and read them as ones and tens.";
    introShort = "This webapp will guide you through the character creation process and let you save and print character sheets to use when playing Stars Without Number"
    introPanelText = "Before you can begin playing Stars Without Number, you need to roll up a character. While the game can theoretically work with just a single player and a GM, things work best with 2–5 friends in addition to the GM. A lone adventurer can get in a lot of trouble out there, and a small group can find it hard to include all the different skills and talents that are often required to survive a sticky situation.With that in mind, you and the others in your gaming group should give a little thought to making characters that work well together. Grim loners make good book protagonists, but they don’t survive well when there’s no author around to bail them out.When making a character, some players like to simply throw the dice and see where they lead. Others prefer to know a little more about the game world and like to have more detail provided beforehand about the worlds and themes of the game. For those who’d prefer a more detailed discussion of the world of Stars Without Number, you can skip ahead to page 120 and read up on it there.";

    render() {
        return (
            <PanelFrame
                descriptionLong={this.introLong}
                descriptionShort={this.introShort}
                title="Stars Without Number Character Creator"
                className="General"
            >
                <Message
                    style={{backgroundColor: "whitesmoke", textAlign: "justify"}}
                    description={this.introPanelText}
                />
            </PanelFrame>
        );
    }
}