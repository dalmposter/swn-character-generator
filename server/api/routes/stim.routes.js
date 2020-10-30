const { Router } = require("express");

module.exports = app =>
{
    const stimController = require("../controllers/stim.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", stimController.findAll);
    objectRouter.get("/:id", stimController.findOne);
    app.use("/api/stims", objectRouter);
}