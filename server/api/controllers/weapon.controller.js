/*
    Controller for fetching weapons
*/

const db = require("../models");
const Op = db.Sequelize.Op;
const Weapons = db.Weapon

const expansions = {
	source: {
		model: db.Source,
		as: "source",
	},
	source_id: {
		model: db.Source,
		as: "source",
	},
	skill: {
		model: db.Skill,
		as: "skill",
	},
	skill_id: {
		model: db.Skill,
		as: "skill",
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

// Get all weapons that match given parameters (or all weapons if none given)
exports.findAll = (req, res) =>
{
	var condition = {  };
	// Create a condition that each string property be like the given values when searching db
	[ "subtype", "name", "attribute", "damage", "shock", "magazine"]
	.forEach(value => {
		if(req.query[value]) condition[value] = { [Op.like]: `%${req.query[value]}%` };
	});
	// For numerical values, they should be an exact match
	[ "source_id", "page", "tech_level", "encumbrance",
		"cost", "range_low", "range_high", "skill_id", "id"]
	.forEach(value => {
		if(req.query[value]) condition[value] = req.query[value];
	})

	Weapons.findAll({ where: condition, include: getIncludeObject(req.query.expand) })
	.then(data => res.send(data))
	.catch(err =>
		res.status(500).send({
		message:
			err.message || "Some error occurred while retrieving weapons"
		})
	);
};

// Get a weapon by ID
exports.findOne = (req, res) =>
{
	const id = req.params.id;

	Weapons.findByPk(id)
	.then(data => res.send(data))
	.catch(err =>
		res.status(500)
		.send({ message: "Error retrieving weapon with id=" + id })
	);
};