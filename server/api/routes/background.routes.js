const { Router } = require("express");

module.exports = app =>
{
    const backgroundController = require("../controllers/background.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", backgroundController.findAll);
    objectRouter.get("/:id", backgroundController.findOne);
    app.use("/api/backgrounds", objectRouter);
}