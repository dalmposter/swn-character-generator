const { Router } = require("express");

module.exports = app =>
{
    const focusController = require("../controllers/focus.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", focusController.findAll);
    objectRouter.get("/:id", focusController.findOne);
    app.use("/api/foci", objectRouter);
}