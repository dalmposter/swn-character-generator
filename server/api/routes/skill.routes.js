const { Router } = require("express");

module.exports = app =>
{
    const skillController = require("../controllers/skill.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", skillController.findAll);
    objectRouter.get("/:id", skillController.findOne);
    app.use("/api/skills", objectRouter);
}