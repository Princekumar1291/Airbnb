const express = require('express');
const hostRouter=express.Router();
const hostController = require('../controllers/hostController');

hostRouter.get('/add-home',hostController.getAddhome)
hostRouter.post('/add-home',hostController.postAddhome)

module.exports={hostRouter};