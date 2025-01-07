const get404=(req,res)=>{
  res.render('store/404', { title: "404" });
}

module.exports = { get404 };