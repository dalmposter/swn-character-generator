/*
    Controller for fetching sources
*/

const db = require("../models");
const Op = db.Sequelize.Op;
const Sources = db.Source

// Get all sources that match given parameters (or all sources if none given)
exports.findAll = (req, res) =>
{
	// Create a condition that each property be like the given values when searching db
	var condition = {};
	// Create a condition that each string property be like the given values when searching db
	[ "description", "name" ]
	.forEach(value => {
		if(req.query[value]) condition[value] = { [Op.like]: `%${req.query[value]}%` };
	});
	if(req.query.id) condition.id = req.query.id;

	Sources.findAll({ where: condition })
	.then(data => {
		data = data.map(source => [source.id, source]);
		data = Object.fromEntries(new Map(data));
		res.send(data);
	})
	.catch(err =>
		res.status(500).send({
		message:
			err.message || "Some error occurred while retrieving sources"
		})
	);
};

// Get a source by ID
exports.findOne = (req, res) =>
{
	const id = req.params.id;

	Sources.findByPk(id)
	.then(data => res.send(data))
	.catch(err =>
		res.status(500)
		.send({ message: "Error retrieving source with id=" + id })
	);
};