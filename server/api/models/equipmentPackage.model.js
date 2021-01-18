/*
	Equipment packages are pre-built collections of items for selection at the start
*/

module.exports = (sequelize, s) => {
	const EquipmentPackage = sequelize.define("equipment_package", {
		name: {
			type: s.STRING(25),
			allowNull: false,
		},
		credits: {
			type: s.INTEGER,
		},
		contents: {
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

	
	EquipmentPackage.associate = models => {
		EquipmentPackage.belongsTo(models.Source, { foreignKey: "source_id", as: "source" });
	}
	
	return EquipmentPackage;
};