/*
  The characters background, their history.
  Gives bonuses to skills and stats
*/

module.exports = (sequelize, s) => {
	const Background = sequelize.define("background", {
		name: {
			type: s.STRING,
			allowNull: false,
		},
		description: {
			type: s.STRING(1024),
		},
		free_skill_id: {
			type: s.INTEGER,
		},
		quick_skill_ids: {
			type: s.JSON,
		},
		growth_skill_ids: {
			type: s.JSON,
		},
		learning_skill_ids: {
			type: s.JSON,
		},
	},
	{ timestamps: false });

	Background.associate = models => {
		Background.belongsTo(models.Source, { foreignKey: "source_id", as: "source" })
	};
	return Background;
};