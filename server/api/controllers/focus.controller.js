/*
    Controller for fetching foci
*/

const db = require("../models");
const Op = db.Sequelize.Op;
const Foci = db.Foci

const expansions = {
	source: {
		model: db.Source,
		as: "source",
	},
	source_id: {
		model: db.Source,
		as: "source",
	},
	level_1_skill: {
		model: db.Skill,
		as: "level_1_skill",
	},
	skill: {
		model: db.Skill,
		as: "level_1_skill",
	}
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

// Get all foci that match given parameters (or all foci if none given)
exports.findAll = (req, res) =>
{
	var condition = {  };
	// Create a condition that each string property be like the given values when searching db
	[ "name", "description", "level_1_description", "level_2_description" ]
	.forEach(value => {
		if(req.query[value]) condition[value] = { [Op.like]: `%${req.query[value]}%` };
	});
	// For numerical values, they should be an exact match
	[ "source_id", "page", "level_1_skill_id", "id", "is_combat" ]
	.forEach(value => {
		if(req.query[value]) condition[value] = req.query[value];
	})

	Foci.findAll({ where: condition, include: getIncludeObject(req.query.expand) })
	.then(data => {
		data = data.map(focus => [focus.id, focus]);
		data = Object.fromEntries(new Map(data));
		res.send(data);
	})
	.catch(err =>
		res.status(500).send({
		message:
			err.message || "Some error occurred while retrieving foci"
		})
	);
};

// Get a focus by ID
exports.findOne = (req, res) =>
{
	const id = req.params.id;

	Foci.findByPk(id)
	.then(data => res.send(data))
	.catch(err =>
		res.status(500)
		.send({ message: "Error retrieving focus with id=" + id })
	);
};