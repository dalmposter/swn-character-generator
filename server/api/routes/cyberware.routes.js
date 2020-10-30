const { Router } = require("express");

module.exports = app =>
{
    const cyberwareController = require("../controllers/cyberware.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", cyberwareController.findAll);
    objectRouter.get("/:id", cyberwareController.findOne);
    app.use("/api/cyberwares", objectRouter);
}