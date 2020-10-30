/*
	Stims are drugs used for healing or other enhancing effects
*/

module.exports = (sequelize, s) => {
	var Stim = sequelize.define("stim", {
		name: {
			type: s.STRING(25),
			allowNull: false,
		},
		description: {
			type: s.STRING(255),
		},
		heal_skill: {
			type: s.INTEGER,
		},
		system_strain: {
			type: s.INTEGER,
		},
		source_id: {
			type: s.INTEGER,
		},
		page: {
			type: s.INTEGER,
		}
	},
	{ timestamps: false });

	
	Stim.associate = models => {
		Stim.belongsTo(models.Source, { foreignKey: "source_id", as: "source" });
	}
	
	return Stim;
};