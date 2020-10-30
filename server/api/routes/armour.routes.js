const { Router } = require("express");

module.exports = app =>
{
    const armourController = require("../controllers/armour.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", armourController.findAll);
    objectRouter.get("/:id", armourController.findOne);
    app.use("/api/armours", objectRouter);
}