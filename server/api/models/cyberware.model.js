/*
	Cyberwares are technological enhancements to the body of the user
	Using them gives some amount of permenant system strain
*/

module.exports = (sequelize, s) => {
	var Cyberware = sequelize.define("cyberware", {
		name: {
			type: s.STRING(50),
			allowNull: false,
		},
		description: {
			type: s.STRING(1500),
		},
		cost: {
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
		},
		tech_level: {
			type: s.INTEGER,
		}
	},
	{ timestamps: false });

	
	Cyberware.associate = models => {
		Cyberware.belongsTo(models.Source, { foreignKey: "source_id", as: "source" });
	}
	
	return Cyberware;
};