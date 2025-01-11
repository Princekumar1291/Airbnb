const Favourites = require("../models/Favourites");
const Home = require("../models/Home");

const getIndex = (req, res) => {
  Home.find().then((registerHomes) => {
    res.render('store/index', { homes: registerHomes, title: "AirBnb" })
  });
}

const getHome = (req, res) => {
  Home.find().then((registerHomes) => {
    res.render('store/homes', { homes: registerHomes, title: "AirBnb" })
  });
}

const getHomeDetails = (req, res) => {
  const _id = req.params._id;
  Home.findById(_id).then((home) => {
    console.log(home);
    if (!home) res.redirect('/homes');
    res.render('store/home-details', { home: home, title: "home-details" })
  }).catch(err => {
    console.error('Error fetching home:', err);
  });
}

const getFavorites = (req, res) => {
  Favourites.fetchAll().then((favouritesIds) => {
    favouritesIds=favouritesIds.map(favourite => favourite.homeId);
    Home.fetchall().then((registerHomes) => {
      const favouriteHomes = registerHomes.filter(home => favouritesIds.includes(home._id.toString()));
      res.render('store/favorites', { homes: favouriteHomes, title: "Favorites" })
    })
  })
}

const postFavorites = (req, res) => {
  let homeId = req.body._id;
  Favourites.findById(homeId).then((favourite) => {
    if (favourite) {
      return res.redirect('/favorites');
    }
    let fav = new Favourites(homeId);
    return fav.save().then(() => {
      res.redirect('/favorites');
    })
  }).catch(err => {
    console.error('Error adding home to favorites:', err);
    res.redirect('/favorites');
  });
}

const deleteFavorites=(req,res)=>{
  let homeId = req.params._id;
  Favourites.deleteById(homeId).then(() => {
    console.log(homeId);
    res.redirect('/favorites');
  }).catch(err => {
    console.error('Error deleting home from favorites:', err);
  });
}


module.exports = { getIndex, getHome, getHomeDetails, getFavorites, postFavorites, deleteFavorites };