const express = require("express");
const { get404 } = require("../controllers/errorController");
const errorRouter = express.Router();

errorRouter.use(get404);

module.exports=errorRouter;