/*
  The characters class, their capabilities.
  Determines starting bonuses and level up bonuses.
*/

module.exports = (sequelize, s) => {
	const ClassDescription = sequelize.define("class_description", {
		name: {
			type: s.STRING,
			allowNull: false,
		},
		description: {
			type: s.STRING(1024),
		},
		bonuses: {
			type: s.JSON,
		},
		level_up_bonuses: {
			type: s.JSON,
		},
		ability_description: {
			type: s.JSON,
		},
		specific_level_bonuses: {
			type: s.JSON,
		},
		source_id: {
			type: s.INTEGER,
		},
		page: {
			type: s.INTEGER,
		},
		hit_die: {
			type: s.STRING(25),
		}
	},
	{ timestamps: false });

	ClassDescription.associate = models => {
		ClassDescription.belongsTo(models.Source, { foreignKey: "source_id", as: "source" });
		ClassDescription.hasOne(models.Class, { foreignKey: "full_class_id", as: "full_class" });
		ClassDescription.hasOne(models.Class, { foreignKey: "partial_class_id", as: "partial_class" })
	};
	return ClassDescription;
};