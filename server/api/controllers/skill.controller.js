/*
    Controller for fetching skills
*/

const db = require("../models");
const Op = db.Sequelize.Op;
const Skills = db.Skill

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
	// Create a condition that each string property be like the given values when searching db
	[ "name", "description"]
	.forEach(value => {
		if(req.query[value]) condition[value] = { [Op.like]: `%${req.query[value]}%` };
	});
	// For numerical values, they should be an exact match
	[ "source_id", "id"]
	.forEach(value => {
		if(req.query[value]) condition[value] = req.query[value];
	});

	Skills.findAll({ where: condition, include: getIncludeObject(req.query.expand) })
	.then(data => res.send(data))
	.catch(err =>
		res.status(500).send({
		message:
			err.message || "Some error occurred while retrieving skills"
		})
	);
};

// Get a skill by ID
exports.findOne = (req, res) =>
{
	const id = req.params.id;

	Skills.findByPk(id)
	.then(data => res.send(data))
	.catch(err =>
		res.status(500)
		.send({ message: "Error retrieving skill with id=" + id })
	);
};