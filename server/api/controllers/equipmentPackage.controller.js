/*
    Controller for fetching equipment packages
*/

const db = require("../models");
const Op = db.Sequelize.Op;
const EquipmentPackages = db.EquipmentPackage

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

// Get all stims that match given parameters (or all stims if none given)
exports.findAll = (req, res) =>
{
	var condition = {  };
	// Create a condition that each string property be like the given values when searching db
	[ "name", "armours", "cyberwares", "equipment", "stims", "weapons" ]
	.forEach(value => {
		if(req.query[value]) condition[value] = { [Op.like]: `%${req.query[value]}%` };
	});
	// For numerical values, they should be an exact match
	[ "source_id", "credits", "id" ]
	.forEach(value => {
		if(req.query[value]) condition[value] = req.query[value];
	})

	EquipmentPackages.findAll({ where: condition, include: getIncludeObject(req.query.expand) })
	.then(data => {
		data = data.map(stim => [stim.id, stim]);
		data = Object.fromEntries(new Map(data));
		res.send(data);
	})
	.catch(err =>
		res.status(500).send({
		message:
			err.message || "Some error occurred while retrieving equipment packages"
		})
	);
};

// Get package by ID
exports.findOne = (req, res) =>
{
	const id = req.params.id;

	EquipmentPackages.findByPk(id)
	.then(data => res.send(data))
	.catch(err =>
		res.status(500)
		.send({ message: "Error retrieving equipment pack with id=" + id })
	);
};