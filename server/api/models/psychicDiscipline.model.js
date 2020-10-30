/*
	Psychic Discliplines are types of psionic powers and schools of these types
*/

module.exports = (sequelize, s) => {
	var PsychicDiscipline = sequelize.define("psychic_discipline", {
		name: {
			type: s.STRING(45),
			allowNull: false,
		},
		description: {
			type: s.STRING(512),
		},
		source_id: {
			type: s.INTEGER,
		},
		page: {
			type: s.INTEGER,
		}
	},
	{ timestamps: false });

	PsychicDiscipline.associate = models => {
		PsychicDiscipline.belongsTo(models.Source, { foreignKey: "source_id", as: "source" });
	}
	
	return PsychicDiscipline;
};