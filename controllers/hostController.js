const Homes = require('../models/homes');

const getAddhome = (req, res) => {
  res.render('host/edit-home', { title: "Add Home", editing: false });
}

const postAddhome = (req, res, next) => {
  let newHome = new Homes(req.body.houseName, req.body.price, req.body.location, req.body.description, req.body.rating, req.body.photoUrl);
  newHome.save().then(() => {
    res.redirect('/host/host-homes');
  })
}

const getHostHomes=(req,res)=>{
  Homes.fetchall().then((registerHomes) => {
    res.render('host/host-homes', { homes: registerHomes, title: "Host Homes" })
  })
}

const getEditHome=(req,res)=>{
  const _id = req.params._id;
  const editing = req.query.editing==='true';
  if(!editing) return res.redirect('/host/host-homes');
  Homes.findById(_id).then((home) => {
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

const postEditHome=(req,res)=>{
  const {_id,houseName,price,location,description,rating,photoUrl}=req.body;
  Homes.updateById(_id,houseName,price,location,description,rating,photoUrl).then(() => {
    res.redirect('/host/host-homes');
  }).catch(err => {
    console.error('Error updating home:', err);
  });
}

const deleteHome=(req,res)=>{
  const _id = req.params._id;
  Homes.deleteById(_id).then(() => {
    console.log('Home deleted successfully');
  }).catch(err => {
    console.error('Error deleting home:', err);
  })
  res.redirect('/host/host-homes');
}

module.exports = { getAddhome, postAddhome , getHostHomes, getEditHome,postEditHome,deleteHome};

