const Favourites = require("../models/Favourites");
const Homes = require("../models/homes");

const getIndex = (req, res) => {
  Homes.fetchall().then((registerHomes) => {
    res.render('store/index', { homes: registerHomes, title: "AirBnb" })
  });
}

const getHome = (req, res) => {
  Homes.fetchall().then((registerHomes) => {
    res.render('store/homes', { homes: registerHomes, title: "AirBnb" })
  });
}

const getHomeDetails = (req, res) => {
  const _id = req.params._id;
  Homes.findById(_id).then((home) => {
    console.log(home);
    if (!home) res.redirect('/homes');
    res.render('store/home-details', { home: home, title: "home-details" })
  }).catch(err => {
    console.error('Error fetching home:', err);
  });
}

const getFavorites = (req, res) => {
  Favourites.fetchAll((favouritesIds) => {
    Homes.fetchall().then(([registerHomes]) => {
      const favouriteHomes = registerHomes.filter(home => favouritesIds.includes(home._id));
      res.render('store/favorites', { homes: favouriteHomes, title: "Favorites" })
    })
  })
}

const postFavorites = (req, res) => {
  let _id = req.body._id;
  console.log(req.body);
  Favourites.addToFavourites(_id, (error) => {
    if (error) console.log(error);
    res.redirect('/favorites');
  });
}

const deleteFavorites = (req, res) => {
  const _id = req.params._id;
  Favourites.removeFromFavourites(_id, (error) => {
    if (error) console.log(error);
  });
  res.redirect('/favorites');
}


module.exports = { getIndex, getHome, getHomeDetails, getFavorites, postFavorites, deleteFavorites };