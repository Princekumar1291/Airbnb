const express = require('express');
const hostRouter=express.Router();
const hostController = require('../controllers/hostController');

hostRouter.get('/add-home',hostController.getAddhome)
hostRouter.post('/add-home',hostController.postAddhome)
hostRouter.get('/host-homes',hostController.getHostHomes)
hostRouter.get('/edit-home/:_id',hostController.getEditHome)
hostRouter.post('/edit-home',hostController.postEditHome)
hostRouter.post('/delete-home/:_id',hostController.deleteHome)

module.exports={hostRouter};