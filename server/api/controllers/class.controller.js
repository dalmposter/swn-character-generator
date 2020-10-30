/*
    Controller for fetching classes
*/

const db = require("../models");
const Op = db.Sequelize.Op;
const Classes = db.Class

const expansions = {
	source: {
		model: db.Source,
		as: "source",
	},
	source_id: {
		model: db.Source,
		as: "source",
	},
	full: {
		model: db.ClassDescription,
		as: "full_class",
	},
	partial: {
		model: db.ClassDescription,
		as: "partial_class",
	}
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
	[ "name", "description" ]
	.forEach(value => {
		if(req.query[value]) condition[value] = { [Op.like]: `%${req.query[value]}%` };
	});
	// For numerical values, they should be an exact match
	[ "source_id", "id", "page", "full_class_id", "partial_class_id" ]
	.forEach(value => {
		if(req.query[value]) condition[value] = req.query[value];
	});

	Classes.findAll({ where: condition, include: getIncludeObject(req.query.expand) })
	.then(data => res.send(data))
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

	Classes.findByPk(id)
	.then(data => res.send(data))
	.catch(err =>
		res.status(500)
		.send({ message: "Error retrieving background with id=" + id })
	);
};