/*
    Generic controller for simple get operations.
*/

const db = require("../models");
const Op = db.Sequelize.Op;

// Get all objects that match given parameters (or all objects if none given)
exports.findAll = (objName, req, res) =>
{
	// Create a condition that each property be like the given values when searching db
	var condition = req.query;
	Object.keys(condition).forEach(key => {
		condition[key] = { [Op.like]: `%${condition[key]}%` }
	});

	db[objName].findAll({ where: condition })
	.then(data => res.send(data))
	.catch(err =>
		res.status(500).send({
		message:
			err.message || "Some error occurred while retrieving " + objName
		})
	);
};

// Get an object by ID
exports.findOne = (objName, req, res) =>
{
	const id = req.params.id;

	db[objName].findByPk(id)
	.then(data => res.send(data))
	.catch(err =>
		res.status(500)
		.send({ message: "Error retrieving " + objName + " with id=" + id })
	);
};