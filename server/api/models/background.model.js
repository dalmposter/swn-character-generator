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
		short_description_start_index: {
			type: s.INTEGER,
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
		source_id: {
			type: s.INTEGER,
		},
		page: {
			type: s.INTEGER,
		}
	},
	{ timestamps: false });

	Background.associate = models => {
		Background.belongsTo(models.Source, { foreignKey: "source_id", as: "source" })
	};
	return Background;
};