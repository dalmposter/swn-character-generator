/*
    Controller for fetching psychic powers
*/

const db = require("../models");
const Op = db.Sequelize.Op;
const Psychics = db.PsychicPower

const expansions = {
	source: {
		model: db.Source,
		as: "source",
	},
	source_id: {
		model: db.Source,
		as: "source",
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

// Get all psychic powers that match given parameters (or all psychics if none given)
exports.findAll = (req, res) =>
{
	var condition = {  };
	// Create a condition that each string property be like the given values when searching db
	[ "name", "commit_effort", "type", "description" ]
	.forEach(value => {
		if(req.query[value]) condition[value] = { [Op.like]: `%${req.query[value]}%` };
	});
	// For numerical values, they should be an exact match
	[ "source_id", "page", "id", "level" ]
	.forEach(value => {
		if(req.query[value]) condition[value] = req.query[value];
	})

	Psychics.findAll({ where: condition, include: getIncludeObject(req.query.expand) })
	.then(data => {
		data = data.map(psychicPower => [psychicPower.id, psychicPower]);
		data = Object.fromEntries(new Map(data));
		res.send(data);
	})
	.catch(err =>
		res.status(500).send({
		message:
			err.message || "Some error occurred while retrieving psychic powers"
		})
	);
};

// Get a psychic power by ID
exports.findOne = (req, res) =>
{
	const id = req.params.id;

	Psychics.findByPk(id)
	.then(data => res.send(data))
	.catch(err =>
		res.status(500)
		.send({ message: "Error retrieving psychic power with id=" + id })
	);
};