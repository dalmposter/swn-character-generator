require('dotenv').config();

const Sequelize = require("sequelize");
const sequelize = new Sequelize("scg_objects", process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  operatorsAliases: false,
  
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.skills = require("./skill.model.js")(sequelize, Sequelize);
db.weapons = require("./weapon.model.js")(sequelize, Sequelize);
db.sources = require("./source.model.js")(sequelize, Sequelize);
db.backgrounds = require("./background.model.js")(sequelize, Sequelize);

module.exports = db;