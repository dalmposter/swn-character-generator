/*
	Weapons are items used in combat.
	They have a lot of properties and many could be null.
*/

module.exports = (sequelize, s) => {
	var Weapon = sequelize.define("weapon", {
		attribute: {
			type: s.STRING(14),
		},
		cost: {
			type: s.INTEGER,
		},
		damage: {
			type: s.STRING(14),
		},
		encumberance: {
			type: s.INTEGER,
		},
		magazine: {
			type: s.STRING(14),
		},
		name: {
			type: s.STRING(60),
			allowNull: false,
		},
		page: {
			type: s.INTEGER,
		},
		range_high: {
			type: s.INTEGER,
		},
		range_low: {
			type: s.INTEGER,
		},
		shock: {
			type: s.STRING(14),
		},
		source_id: {
			type: s.INTEGER,
		},
		subtype: {
			type: s.STRING(45),
		},
		tech_level: {
			type: s.INTEGER,
		},
		skill_id: {
			type: s.INTEGER,
		}
	},
	{ timestamps: false });

	Weapon.associate = models => {
		Weapon.belongsTo(models.Source, { foreignKey: "source_id", as: "source" });
		Weapon.belongsTo(models.Skill, { foreignKey: "skill_id", as: "skill" });
	};
	
	return Weapon;
};