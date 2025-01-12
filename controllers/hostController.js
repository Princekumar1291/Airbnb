const Favourite = require('../models/Favourite.js');
const Home = require('../models/Home.js');

const getAddhome = (req, res) => {
  res.render('host/edit-home', { title: "Add Home", editing: false });
}

const postAddhome = (req, res, next) => {
  let { houseName, price, location, description, rating, photoUrl } = req.body;
  let newHome = new Home({ houseName, price, location, description, rating, photoUrl });
  newHome.save().then(() => {
    res.redirect('/host/host-homes');
  }).catch(err => {
    console.error('Error adding home:', err);
    res.redirect('/host/add-home');
  })
}

const getHostHomes = (req, res) => {
  Home.find().then((registerHomes) => {
    res.render('host/host-homes', { homes: registerHomes, title: "Host Home" })
  })
}

const getEditHome = (req, res) => {
  const _id = req.params._id;
  const editing = req.query.editing === 'true';
  if (!editing) return res.redirect('/host/host-homes');
  Home.findById(_id).then((home) => {
    if (!home) {
      return res.redirect('/host-homes');
    }
    res.render('host/edit-home', {
      home: home,
      title: "Edit Home",
      editing: editing
    });
  }).catch(err => {
    console.error('Error fetching home:', err);
    res.redirect('/host-homes');
  });
}

const postEditHome = (req, res) => {
  const { _id, houseName, price, location, description, rating, photoUrl } = req.body;
  Home.findOneAndUpdate({ _id: _id }, { houseName, price, location, description, rating, photoUrl }).then(() => {
    res.redirect('/host/host-homes');
  }).catch(err => {
    console.error('Error updating home:', err);
    res.redirect('/host/edit-home');
  });
}

const deleteHome = (req, res) => {
  const _id = req.params._id;
  Favourite.deleteOne({ homeId: _id }).then(() => {
    console.log('Home deleted from favorites');
  }).catch(err => {
    console.error('Error deleting home from favorites:', err);
  })
  Home.findOneAndDelete(_id).then(() => {
    res.redirect('/host/host-homes');
  }).catch(err => {
    console.error('Error deleting home:', err);
  });
}

module.exports = { getAddhome, postAddhome, getHostHomes, getEditHome, postEditHome, deleteHome };

