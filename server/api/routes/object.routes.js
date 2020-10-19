const { Router } = require("express");

module.exports = app =>
{
    const objectController = require("../controllers/object.controller.js");

    // Add naive/generic routes for any game objects in this array using the object controller
    ["skills", "weapons", "sources", "backgrounds"].forEach(objName =>
    {
        var objectRouter = Router();
        objectRouter.get("/", objectController.findAll.bind(this, objName));
        objectRouter.get("/:id", objectController.findOne.bind(this, objName));
        app.use(`/api/${objName}`, objectRouter);
    });
}