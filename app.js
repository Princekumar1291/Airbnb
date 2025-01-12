//Core modules
const path = require('path');

//External modules
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

//Internal modules
const { hostRouter } = require('./router/hostRouter');
const storeRouter = require('./router/storeRouter');
const rootDir = require('./utils/path-util');
const errorRouter = require('./router/errorRouter');
const { authRouter } = require('./router/authRouter');

//Middlewares
app.use(express.static(path.join(rootDir, "public")));
app.use(cookieParser());

//Set the view engine
app.set("view engine", "ejs"); //Set the view engine
app.set("views", path.join(rootDir, "views")); //Set the views directory


app.use(bodyparser.urlencoded({ extended: false }));
app.use(storeRouter);
app.use("/auth",authRouter);

app.use((req, res, next) => {
  if (!req.cookies.isLoggedIn ) {
    return res.redirect('/auth/login');    
  }
  next();
})
app.use('/host', hostRouter);

app.use(errorRouter)

const PORT = 3000;
const mongoDbUrl = "mongodb+srv://princekumar7320918928:pAOc56hFAYtRLPwu@princecluster.ns8if.mongodb.net/airbnb?retryWrites=true&w=majority&appName=PrinceCluster";
mongoose.connect(mongoDbUrl).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.log(error);
})