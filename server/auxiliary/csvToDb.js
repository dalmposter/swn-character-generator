/*
    Script to enter csv data into objects database
*/

const csv = require("csv-parser");
const fs = require("fs");
const { exit } = require("process");
const db = require("../api/models");
require('dotenv').config();

var args = process.argv.slice(2);
console.log("args:", args);

/*
    Args:
    1) csv file location
    2) name of model in sequelize
*/

if(args.length < 2)
{
    console.log("Please enter 2 arguments (csv file, object name)");
    exit(1);
}

var fileLoc = args[0];
var objectName = args[1];

const table = db[objectName];
if(!table)
{
    console.log("given object name must match a model in database");
    exit(1);
}

fs.createReadStream(fileLoc)
    .pipe(csv())
    .on("data", async function (entry) {
        Object.keys(entry).map(key => {
            if(['', '-'].includes(entry[key])) entry[key] = null;
            // Sometimes excel puts zero width spaces at the start of csv headers.
            // Remove them so the names match the database.
            if(key.includes('﻿'))
            {
                entry[key.split('﻿').join('')] = entry[key];
                delete entry[key];
            }
        });
        if(entry.source)
        {
            var source = await db.Source.findOne({ where: { name: entry.source } });
            entry = { ...entry, source_id: source.dataValues.id };
        }
        // Sometimes excel creates a column with header [zero width space]. Just delete these entries
        if(entry['﻿']) delete entry['﻿'];
        //console.log("Entry: ", entry);
        table.create(entry).catch(err => console.warn("Error occured: ", err));
    })
    .on("end", () => {
        console.log("Done");
    });