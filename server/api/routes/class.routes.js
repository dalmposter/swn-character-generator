const { Router } = require("express");

module.exports = app =>
{
    const classController = require("../controllers/class.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", classController.findAll);
    objectRouter.get("/:id", classController.findOne);
    app.use("/api/classes", objectRouter);
}