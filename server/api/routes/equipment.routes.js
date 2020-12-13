const { Router } = require("express");

module.exports = app =>
{
    const equipmentController = require("../controllers/equipment.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", equipmentController.findAll);
    objectRouter.get("/:id", equipmentController.findOne);
    app.use("/api/equipments", objectRouter);
}