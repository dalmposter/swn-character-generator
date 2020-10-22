const { Router } = require("express");

module.exports = app =>
{
    const sourceController = require("../controllers/source.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", sourceController.findAll);
    objectRouter.get("/:id", sourceController.findOne);
    app.use("/api/sources", objectRouter);
}