/*
  The main spending location of skill points.
  Used to pass skill checks and execute actions.
*/

module.exports = (sequelize, s) => {
	const Skill = sequelize.define("skill", {
		name: {
			type: s.STRING,
			allowNull: false,
		},
		description: {
			type: s.STRING(1024),
		},
		source_id: {
			type: s.INTEGER,
		},
		page: {
			type: s.INTEGER,
		},
		system: {
			type: s.BOOLEAN,
		}
	},
	{ timestamps: false });

	Skill.associate = models => {
		Skill.belongsTo(models.Source, { foreignKey: "source_id", as: "source" })
	};
	
	return Skill;
};