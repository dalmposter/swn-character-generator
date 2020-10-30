const { Router } = require("express");

module.exports = app =>
{
    const classDescriptionController = require("../controllers/classDescription.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", classDescriptionController.findAll);
    objectRouter.get("/:id", classDescriptionController.findOne);
    app.use("/api/class-descriptions", objectRouter);
}