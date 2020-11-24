/*
  The characters class, their capabilities.
  Determines starting bonuses and level up bonuses.
*/

module.exports = (sequelize, s) => {
	const Class = sequelize.define("class", {
		name: {
			type: s.STRING,
			allowNull: false,
			unique: true,
		},
		full_class_id: {
			type: s.INTEGER,
		},
		partial_class_id: {
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

	Class.associate = models => {
		Class.belongsTo(models.Source, { foreignKey: "source_id", as: "source" });
		Class.belongsTo(models.ClassDescription, { foreignKey: "full_class_id", as: "full_class" });
		Class.belongsTo(models.ClassDescription, { foreignKey: "partial_class_id", as: "partial_class" });
	};
	return Class;
};