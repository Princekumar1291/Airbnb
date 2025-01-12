const getLogin=(req,res)=>{
  res.render('auth/login', { title: "Login" , isLoggedIn: false});
}

const postLogin=(req,res)=>{
  req.session.isLoggedIn = true;
  res.redirect('/homes');
}

const logout=(req,res)=>{
  req.session.destroy();
  res.redirect('/auth/login');
}

const getSignup=(req,res)=>{
  res.render('auth/signup', { title: "Signup" , isLoggedIn: false});
}

const postSignup=(req,res)=>{
  console.log(req.body);
  res.redirect('/auth/login');
}

module.exports={getLogin,postLogin,logout,getSignup,postSignup};