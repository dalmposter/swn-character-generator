/*
    Webserver
    Provides javascript and other web content to clients
    Also has endpoints allowing the clients to interact with the database
*/
import { getWeapons } from "./api/weapons";

const express = require('express');
const path = require('path');
const mysql = require('mysql');

// Pull in environment variables from .env file
require('dotenv').config();

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/index.html'));
});

// Take port from .env file or real environment variables. Default to 5000
const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);

// Test connection to database
var db;
try
{
    db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    db.connect(function(err)
    {
        if(err) throw err;
        console.log("Connected to database!");
    })
}
catch(err) { console.warn("Failed to connect to database: ", err); }