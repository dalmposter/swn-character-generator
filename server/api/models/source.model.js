/*
	A source is a book or other origin for a game object
	This includes the core rules, expansions and custom content
*/

module.exports = (sequelize, s) => {
	var Source = sequelize.define("object_source", {
		name: {
			type: s.STRING,
		},
		description: {
			type: s.STRING,
		}
	},
	{ timestamps: false });

	Source.associate = models => {
		//Source.hasMany(models.Skill, { foreignKey: "source_id", as: "skills" });
		//Source.hasMany(models.Weapon, { foreignKey: "source_id", as: "weapons" });
	};
	
	return Source;
};