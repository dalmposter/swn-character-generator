const { Router } = require("express");

module.exports = app =>
{
    const packageController = require("../controllers/equipmentPackage.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", packageController.findAll);
    objectRouter.get("/:id", packageController.findOne);
    app.use("/api/equipment-packages", objectRouter);
}