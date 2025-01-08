const express = require("express");
const storeRouter = express.Router();
const storeController = require("../controllers/storeController");


storeRouter.get("/",storeController.getIndex);
storeRouter.get('/homes',storeController.getHome);
storeRouter.get('/homes/:id',storeController.getHomeDetails);
storeRouter.get('/favorites',storeController.getFavorites);
storeRouter.post('/favorites',storeController.postFavorites);
storeRouter.post('/favorites/delete/:id',storeController.deleteFavorites);

module.exports = storeRouter;