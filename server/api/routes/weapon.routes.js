const { Router } = require("express");

module.exports = app =>
{
    const weaponController = require("../controllers/weapon.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", weaponController.findAll);
    objectRouter.get("/:id", weaponController.findOne);
    app.use("/api/weapons", objectRouter);
}