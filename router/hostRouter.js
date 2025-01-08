const express = require('express');
const hostRouter=express.Router();
const hostController = require('../controllers/hostController');

hostRouter.get('/add-home',hostController.getAddhome)
hostRouter.post('/add-home',hostController.postAddhome)
hostRouter.get('/host-homes',hostController.getHostHomes)
hostRouter.get('/edit-home/:id',hostController.getEditHome)
hostRouter.post('/edit-home',hostController.postEditHome)

module.exports={hostRouter};