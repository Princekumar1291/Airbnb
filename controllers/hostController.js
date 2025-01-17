const Home = require('../models/Home.js');
const {upload} = require('../utils/cloudanary-utils');

const getAddhome = (req, res) => {
  res.render('host/edit-home', { title: "Add Home", editing: false,isLoggedIn: req.session.isLoggedIn,user:req.session.user });
}

const postAddhome = [
  upload.single('photo'),
  (req, res, next) => {
  let { houseName, price, location, description, rating } = req.body;
  if(!req.file){
    return res.redirect('/host/add-home');    
  }
  let photoUrl = req.file.path;
  let hostId=req.session.user._id
  let newHome = new Home({ houseName, price, location, description, rating, photoUrl ,hostId});
  newHome.save().then(() => {
    res.redirect('/host/host-homes');
  }).catch(err => {
    console.error('Error adding home:', err);
    res.redirect('/host/add-home');
  })
}]

const getHostHomes = async (req, res) => {
  const userId = req.session.user._id;
  try {
    const homes=await Home.find({hostId:userId});
    res.render('host/host-homes', { homes: homes, title: "Host Homes", isLoggedIn: req.session.isLoggedIn, user: req.session.user });
  } catch (error) {
    console.error('Error fetching homes:', error);
    res.redirect('/host/host-homes');
  }
  
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
      editing: editing,
      isLoggedIn: req.session.isLoggedIn,
      user:req.session.user
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

const deleteHome =async (req, res) => {
  const _id = req.params._id;
  try {
    await Home.findByIdAndDelete(_id);
    res.redirect('/host/host-homes');
  } catch (error) {
    console.error('Error deleting home:', error);
    res.redirect('/host/host-homes');
  }
}

module.exports = { getAddhome, postAddhome, getHostHomes, getEditHome, postEditHome, deleteHome };

