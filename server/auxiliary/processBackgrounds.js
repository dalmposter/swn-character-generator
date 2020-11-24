/*
    Script to remove excess spaces and hyphens from background description strings
*/

const db = require("../api/models");
require('dotenv').config();

db.Background.findAll().then(backgrounds =>
{
    backgrounds = backgrounds.map(background =>
    {
        // Remove all excess spaces
        while(background.description.includes("  ")) 
        {
            background.description = background.description.replace(/  /g, " ");
        }
        // Remove all hyphens
        background.description = background.description.replace(/-/g, "");
        background.save().then(() => console.log("Successfully saved", background));
    });
});