const Favourites = require("../models/Favourites");
const Homes = require("../models/homes");

const getIndex = (req, res) => {
  Homes.fetchall((registerHomes) => { res.render('store/index', { homes: registerHomes, title: "AirBnb" }) });
}

const getHome = (req, res) => {
  Homes.fetchall((registerHomes) => { res.render('store/homes', { homes: registerHomes, title: "AirBnb" }) });
}

const getHomeDetails = (req, res) => {
  const HomeId = req.params.id;
  Homes.findById(HomeId, (home) => {
    if (!home) res.redirect('/homes');
    res.render('store/home-details', { home: home, title: "home-details" })
  });
}

const getFavorites = (req, res) => {
  Favourites.fetchAll((favouritesIds) => {
    Homes.fetchall((registerHomes) => {
      const favouriteHomes=registerHomes.filter(home=>favouritesIds.includes(home.id));
      res.render('store/favorites', { homes: favouriteHomes, title: "Favorites" })  
    })
  })
}

const postFavorites = (req, res) => {
  let homeId = req.body.id;
  console.log(req.body);
  Favourites.addToFavourites(homeId, (error) => {
    if (error) console.log(error);
    res.redirect('/favorites');
  });
}


module.exports = { getIndex, getHome, getHomeDetails, getFavorites, postFavorites};