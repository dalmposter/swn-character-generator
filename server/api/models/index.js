/**
 *  Create and export the store of game objects fetched via Sequelize
*/
require('dotenv').config();
var Sequelize = require("sequelize");

console.log("dialect:", process.env.DB_DIALECT);

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

const db = {
	
};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Skill = require("./skill.model.js")(sequelize, Sequelize);
db.Weapon = require("./weapon.model.js")(sequelize, Sequelize);
db.Source = require("./source.model.js")(sequelize, Sequelize);
db.Background = require("./background.model.js")(sequelize, Sequelize);
db.PsychicPower = require("./psychicPower.model.js")(sequelize, Sequelize);
db.Armour = require("./armour.model.js")(sequelize, Sequelize);
db.Cyberware = require("./cyberware.model.js")(sequelize, Sequelize);
db.PsychicDiscipline = require("./psychicDiscipline.model.js")(sequelize, Sequelize);
db.Stim = require("./stim.model.js")(sequelize, Sequelize);
db.Foci = require("./focus.model.js")(sequelize, Sequelize);
db.Equipment = require("./equipment.model.js")(sequelize, Sequelize);
db.Class = require("./class.model.js")(sequelize, Sequelize);
db.ClassDescription = require("./classDescription.model.js")(sequelize, Sequelize);
db.EquipmentPackage = require("./equipmentPackage.model.js")(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;