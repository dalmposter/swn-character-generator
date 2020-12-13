/*
    Controller for fetching psychic discipline
*/

const db = require("../models");
const Op = db.Sequelize.Op;
const PsychicDisciplines = db.PsychicDiscipline

const expansions = {
	source: {
		model: db.Source,
		as: "source",
	},
	source_id: {
		model: db.Source,
		as: "source",
	},
	powers: {
		model: db.PsychicPower,
		as: "powers",
	},
}

// Generate an object telling sequelize to fetch the linked objects for fields given in expand
function getIncludeObject(expand)
{
	return expand
		? 
		expand.split(",").map(value => expansions[value]).filter(value => value)
		:
		[];
}

// Get all skills that match given parameters (or all skills if none given)
exports.findAll = (req, res) =>
{
	// Create a condition that each property be like the given values when searching db
	var condition = {};
	[ "name", "description" ]
	.forEach(value => {
		if(req.query[value]) condition[value] = { [Op.like]: `%${req.query[value]}%` };
	});
	// For numerical values, they should be an exact match
	[ "source_id", "id", "page" ]
	.forEach(value => {
		if(req.query[value]) condition[value] = req.query[value];
	});

	PsychicDisciplines.findAll({ where: condition, include: getIncludeObject(req.query.expand) })
	.then(data => {
		data = data.map(psychicDiscipline => [psychicDiscipline.id, psychicDiscipline]);
		data = Object.fromEntries(new Map(data));
		res.send(data);
	})
	.catch(err =>
		res.status(500).send({
		message:
			err.message || "Some error occurred while retrieving skills"
		})
	);
};

// Get a background by ID
exports.findOne = (req, res) =>
{
	const id = req.params.id;

	PsychicDisciplines.findByPk(id)
	.then(data => res.send(data))
	.catch(err =>
		res.status(500)
		.send({ message: "Error retrieving background with id=" + id })
	);
};