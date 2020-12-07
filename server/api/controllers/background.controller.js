/*
    Controller for fetching backgrounds
*/

const db = require("../models");
const Op = db.Sequelize.Op;
const Backgrounds = db.Background

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
	if(req.query.name) condition.name = { [Op.like]: `%${req.query.name}%` };
	if(req.query.description) condition.description = { [Op.like]: `%${req.query.description}%` };

	Backgrounds.findAll({ where: condition, include: getIncludeObject(req.query.expand) })
	.then(data => {
		data = data.map(background => [background.id, background]);
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

	Backgrounds.findByPk(id)
	.then(data => res.send(data))
	.catch(err =>
		res.status(500)
		.send({ message: "Error retrieving background with id=" + id })
	);
};