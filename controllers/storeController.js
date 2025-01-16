const Home = require("../models/Home");
const User = require("../models/User");

const getIndex = (req, res) => {
  console.log(req.session);
  Home.find().then((registerHomes) => {

    res.render('store/index', { homes: registerHomes, title: "AirBnb", isLoggedIn: req.session.isLoggedIn, user: req.session.user });
  });
}

const getHome = (req, res) => {
  Home.find().then((registerHomes) => {
    res.render('store/homes', { homes: registerHomes, title: "AirBnb", isLoggedIn: req.session.isLoggedIn, user: req.session.user });
  });
}

const getHomeDetails = (req, res) => {
  const _id = req.params._id;
  Home.findById(_id).then((home) => {
    if (!home) res.redirect('/homes');
    res.render('store/home-details', { home: home, title: "home-details", isLoggedIn: req.session.isLoggedIn, user: req.session.user });
  }).catch(err => {
    console.error('Error fetching home:', err);
  });
}

const getFavorites =async (req, res) => {
  const userId = req.session.user._id;
  try {
    const user = await User.findById(userId).populate('favouriteHomes');
    res.render('store/favorites', { homes: user.favouriteHomes, title: "Favorites", isLoggedIn: req.session.isLoggedIn, user: req.session.user });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.redirect('/favorites');
  }
}

const postFavorites = async (req, res) => {
  let homeId = req.body._id;
  const userId = req.session.user._id;
  try {
    const user = await User.findById(userId);
    if (user.favouriteHomes.includes(homeId)) {
      return res.redirect('/favorites');
    }
    user.favouriteHomes.push(homeId);
    await user.save();
    res.redirect('/favorites');
  } catch (error) {
    console.error('Error adding home to favorites:', error);
    res.redirect('/favorites');
  }

}

const deleteFavorites = async (req, res) => {
  let homeId = req.params._id;
  const userId = req.session.user._id;
  try {
    const user = await User.findById(userId);
    user.favouriteHomes.pull(homeId);
    await user.save();
    res.redirect('/favorites');
  } catch (error) {
    console.error('Error deleting home from favorites:', error);
    res.redirect('/favorites');
  }
}


module.exports = { getIndex, getHome, getHomeDetails, getFavorites, postFavorites, deleteFavorites };