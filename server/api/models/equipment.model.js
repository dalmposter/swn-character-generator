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
		encumbrance: {
			type: s.FLOAT,
		},
		cost: {
			type: s.INTEGER,
		},
		category: {
			type: s.STRING(25),
		},
		source_id: {
			type: s.INTEGER,
		},
		page: {
			type: s.INTEGER,
		}
	},
	{ timestamps: false });

	Equipment.associate = models => {
		Equipment.belongsTo(models.Source, { foreignKey: "source_id", as: "source" })
	};
	return Equipment;
};