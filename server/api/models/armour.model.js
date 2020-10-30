/*
	Armours are items of clothing worn to increase armour class at some encumbrance costs
*/

module.exports = (sequelize, s) => {
	var Armour = sequelize.define("armour", {
		name: {
			type: s.STRING(25),
			allowNull: false,
		},
		description: {
			type: s.STRING(1000),
		},
		subtype: {
			type: s.STRING(25),
		},
		source_id: {
			type: s.INTEGER,
		},
		page: {
			type: s.INTEGER,
		},
		armour_class: {
			type: s.INTEGER,
		},
		carry_mod: {
			type: s.INTEGER,
		},
		tech_level: {
			type: s.INTEGER,
		},
		encumbrance: {
			type: s.INTEGER,
		},
		cost: {
			type: s.INTEGER,
		},
	},
	{ timestamps: false });

	
	Armour.associate = models => {
		Armour.belongsTo(models.Source, { foreignKey: "source_id", as: "source" });
	}
	
	return Armour;
};