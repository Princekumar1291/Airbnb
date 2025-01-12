const get404=(req,res)=>{
  res.render('store/404', { title: "404" , isLoggedIn: false});
}

module.exports = { get404 };