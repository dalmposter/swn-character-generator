/*
	Psychic Powers are like skills or spells used by psionics
*/

module.exports = (sequelize, s) => {
	var PsychicPower = sequelize.define("psychic_power", {
		level: {
			type: s.INTEGER,
		},
		name: {
			type: s.STRING(45),
			allowNull: false,
		},
		commit_effort: {
			type: s.STRING(15),
		},
		source_id: {
			type: s.INTEGER,
		},
		page: {
			type: s.INTEGER,
		},
		type_id: {
			type: s.INTEGER,
		},
		description: {
			type: s.STRING(2500),
		}
	},
	{ timestamps: false });

	PsychicPower.associate = models => {
		PsychicPower.belongsTo(models.Source, { foreignKey: "source_id", as: "source" });
		PsychicPower.belongsTo(models.PsychicDiscipline, { foreignKey: "type_id", as: "type" });
	};
	
	return PsychicPower;
};