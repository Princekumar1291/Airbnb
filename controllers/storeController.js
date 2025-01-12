const Favourite = require("../models/Favourite");
const Home = require("../models/Home");

const getIndex = (req, res) => {
  console.log(req.session);  
  Home.find().then((registerHomes) => {
  
    res.render('store/index', { homes: registerHomes, title: "AirBnb", isLoggedIn: req.session.isLoggedIn });
  });
}

const getHome = (req, res) => {
  Home.find().then((registerHomes) => {
    res.render('store/homes', { homes: registerHomes, title: "AirBnb" , isLoggedIn: req.session.isLoggedIn});
  });
}

const getHomeDetails = (req, res) => {
  const _id = req.params._id;
  Home.findById(_id).then((home) => {
    if (!home) res.redirect('/homes');
    res.render('store/home-details', { home: home, title: "home-details" , isLoggedIn: req.session.isLoggedIn});
  }).catch(err => {
    console.error('Error fetching home:', err);
  });
}

const getFavorites = (req, res) => {
  Favourite.find().populate('homeId').then((favourites) => {
    console.log(favourites);
    const favouriteHomes = favourites.map(favourite => favourite.homeId);
    res.render('store/favorites', { homes: favouriteHomes, title: "Favorites", isLoggedIn: req.session.isLoggedIn });
  })
}

const postFavorites = (req, res) => {
  let homeId = req.body._id;
  let fav = new Favourite({ homeId: homeId });
  fav.save()
    .then(() => {
      res.redirect('/favorites');
    })
    .catch(err => {
      if (err.code === 11000) { // duplicate key error code
        console.log('Home already added to favorites');
      } else {
        console.error('Error adding home to favorites:', err);
      }
      res.redirect('/favorites');
    });
}

const deleteFavorites=(req,res)=>{
  let homeId = req.params._id;
  Favourite.findOneAndDelete({homeId:homeId}).then(() => {
    res.redirect('/favorites');
  }).catch(err => {
    console.error('Error deleting home from favorites:', err);
    res.redirect('/favorites');
  })
}


module.exports = { getIndex, getHome, getHomeDetails, getFavorites, postFavorites, deleteFavorites };