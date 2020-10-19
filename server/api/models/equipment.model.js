/*
  Items characters buy, find, and otherwise aquire.
  NOTE: does not include weapons or armour
*/

module.exports = (sequelize, s) => {
	const Equipment = sequelize.define("equipment", {
		name: {
			type: s.STRING,
			allowNull: false,
		},
		description: {
			type: s.STRING(1024),
		},
		tech_level: {
			type: s.INTEGER,
		},
		encumberance: {
			type: s.FLOAT,
		},
		cost: {
			type: s.INTEGER,
		},
		system_strain: {
			type: s.INTEGER,
		},
		heal_skill: {
			type: s.INTEGER,
		},
		// gear / cyberware / stim
		type_key: {
			type: s.STRING,
		}
	},
	{ timestamps: false });

	Equipment.associate = models => {
		Equipment.belongsTo(models.Source, { foreignKey: "source_id", as: "source" })
	};
	return Equipment;
};