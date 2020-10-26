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

fs.createReadStream(fileLoc)
    .pipe(csv())
    .on("data", async function (entry) {
        Object.keys(entry).map(key => {
            if(['', '-'].includes(entry[key])) entry[key] = null;
        });
        if(entry.source)
        {
            var source = await db.Source.findOne({ where: { name: entry.source } });
            entry = { ...entry, source_id: source.dataValues.id };
        }
        if(entry['﻿']) delete entry['﻿'];
        //console.log("Entry: ", entry);
        table.create(entry).catch(err => console.warn("Error occured: ", err));
    })
    .on("end", () => {
        console.log("Done");
    });