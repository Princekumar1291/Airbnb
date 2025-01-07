const Homes = require("../models/homes");

const getHome=(req,res)=>{
  Homes.fetchall((registerHomes)=>{res.render('index',{homes:registerHomes,title:"AirBnb"})});
}


module.exports={getHome};