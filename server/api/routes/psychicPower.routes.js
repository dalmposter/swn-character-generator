const { Router } = require("express");

module.exports = app =>
{
    const psychicController = require("../controllers/psychicPower.controller.js");

    var objectRouter = Router();
    objectRouter.get("/", psychicController.findAll);
    objectRouter.get("/:id", psychicController.findOne);
    app.use("/api/psychic-powers", objectRouter);
}