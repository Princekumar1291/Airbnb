const Homes = require('../models/homes');

const getAddhome = (req, res) => {
  res.render('add-home', { title: "Add Home" });
}

const postAddhome = (req, res, next) => {
  let newHome = new Homes(req.body.houseName, req.body.price, req.body.location, req.body.description, req.body.rating, req.body.photoUrl);
  newHome.save((error) => {
    if (error) res.redirect('/');
    else res.render('home-added', { title: "Home Added" });
  });
}

module.exports = { getAddhome, postAddhome };