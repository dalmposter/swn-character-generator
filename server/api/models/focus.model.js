/*
	Focuss are items used in combat.
	They have a lot of properties and many could be null.
*/

module.exports = (sequelize, s) => {
	var Focus = sequelize.define("focus", {
		name: {
			type: s.STRING(60),
			allowNull: false,
		},
		page: {
			type: s.INTEGER,
		},
		source_id: {
			type: s.INTEGER,
		},
		level_1_skill_id: {
			type: s.INTEGER,
		},
		level_1_description: {
			type: s.STRING(750),
		},
		level_2_description: {
			type: s.STRING(500),
		},
		is_combat: {
			type: s.BOOLEAN,
		}
	},
	{ timestamps: false });

	Focus.associate = models => {
		Focus.belongsTo(models.Source, { foreignKey: "source_id", as: "source" });
		Focus.belongsTo(models.Skill, { foreignKey: "level_1_skill_id", as: "level_1_skill" });
	}
	
	return Focus;
};