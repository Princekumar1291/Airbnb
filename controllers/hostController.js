const Homes = require('../models/homes');

const getAddhome = (req, res) => {
  res.render('host/edit-home', { title: "Add Home", editing: false });
}

const postAddhome = (req, res, next) => {
  let newHome = new Homes(req.body.houseName, req.body.price, req.body.location, req.body.description, req.body.rating, req.body.photoUrl);
  newHome.save((error) => {
    if (error) res.redirect('/');
    else res.render('host/home-added', { title: "Home Added" });
  });
}

const getHostHomes=(req,res)=>{
  Homes.fetchall((registerHomes) => {
    res.render('host/host-homes', { homes: registerHomes, title: "Host Homes" })
  })
}

const getEditHome=(req,res)=>{
  const HomeId = req.params.id;
  const editing = req.query.editing==='true';
  if(!editing) return res.redirect('/host/host-homes');
  Homes.findById(HomeId, (home) => {
    if (!home) res.redirect('/host-homes');
    res.render('host/edit-home', { home: home, title: "Edit Home" , editing: editing })
  });
}

const postEditHome=(req,res)=>{
  const {id,houseName,price,location,description,rating,photoUrl}=req.body;
  const newHome=new Homes(houseName,price,location,description,rating,photoUrl);
  newHome.id=id;
  newHome.save((error)=>{
    if(error) res.redirect('/host/host-homes');
    else res.redirect('/host/host-homes');
  });
}

const deleteHome=(req,res)=>{
  const HomeId = req.params.id;
  Homes.deleteById(HomeId, (error) => {
    if (error) console.log(error);
  });
  res.redirect('/host/host-homes');
}

module.exports = { getAddhome, postAddhome , getHostHomes, getEditHome,postEditHome,deleteHome};