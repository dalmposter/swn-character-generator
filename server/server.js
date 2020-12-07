/*
    Webserver entrypoint.
    Enable middleware and define basic routes serving the client
    Import routes from the api and test database connection
*/

var express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require('path');
var mysql = require('mysql2');
// Pull in environment variables from .env file
require('dotenv').config();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var corsOptions = { origin: "http://localhost:8081" };
app.use(cors(corsOptions));

// Serve the static files from the React app (client)
app.use(express.static(path.join(__dirname, 'client/build')));

// Api routes
require("./api/routes/skill.routes")(app);
require("./api/routes/background.routes")(app);
require("./api/routes/source.routes")(app);
require("./api/routes/weapon.routes")(app);
require("./api/routes/psychicPower.routes")(app);
require("./api/routes/psychicDiscipline.routes")(app);
require("./api/routes/armour.routes")(app);
require("./api/routes/cyberware.routes")(app);
require("./api/routes/equipment.routes")(app);
require("./api/routes/focus.routes")(app);
require("./api/routes/stim.routes")(app);
require("./api/routes/class.routes")(app);
require("./api/routes/classDescription.routes")(app);

// Redirect everything else to the homepage
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// Take port from .env file or real environment variables. Default to 5000
var port = process.env.PORT || 5000;
app.listen(port);
console.log('App is listening on port ' + port);

// Test connection to database
try {
    var connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    connection.connect(function (err) {
        if (err)
            throw err;
        console.log("Connected to database!");
    });
}
catch (err) {
    console.warn("Failed to connect to database: ", err);
}

// Create any needed tables in db
const db = require("./api/models");
db.sequelize.sync();
