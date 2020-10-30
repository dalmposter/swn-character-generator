/*
    Script to enter class json descriptors into objects database
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
    1) json file location
*/

if(args.length < 1)
{
    console.log("Please enter 1 argument: the json file location");
    exit(1);
}

var fileLoc = args[0];

var classes = JSON.parse(fs.readFileSync(fileLoc));

classes.forEach(async function(classEntry) {
    var fullDescriptor = classEntry.full;
    var partialDescriptor = classEntry.partial;
    var entry = db.Class.build(classEntry);

    if(fullDescriptor)
    {
        var full = await db.ClassDescription.create({ ...fullDescriptor, name: entry.name });
        console.log("full", full);
        entry.full_class_id = full.dataValues.id;
    }
    if(partialDescriptor)
    {
        var partial = await db.ClassDescription.create({ ...partialDescriptor, name: entry.name });
        entry.partial_class_id = partial.dataValues.id;
    }
    entry.save();
});