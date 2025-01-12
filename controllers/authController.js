const getLogin=(req,res)=>{
  res.render('auth/login', { title: "Login" , isLoggedIn: false});
}

const postLogin=(req,res)=>{
  res.cookie('isLoggedIn', true, { maxAge: 900000 });
  res.redirect('/');
}

const logout=(req,res)=>{
  res.clearCookie('isLoggedIn');
  res.redirect('/auth/login');
}

module.exports={getLogin,postLogin,logout};