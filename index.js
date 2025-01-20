
//Core modules
const path = require('path');
const fs=require('fs');

//External modules
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const helmet = require('helmet');
const compression = require('compression');



// Load environment variables
require('dotenv').config(); 

// Database url
const MONGO_DB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@princecluster.ns8if.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=PrinceCluster`;

// Database connection for sessions
const sessionStore = new MongoDBStore({
  uri: MONGO_DB_URL,
  collection: 'sessions'
});




//Internal modules
const { hostRouter } = require('./router/hostRouter');
const storeRouter = require('./router/storeRouter');
const rootDir = require('./utils/path-util');
const errorRouter = require('./router/errorRouter');
const { authRouter } = require('./router/authRouter');



//Middlewares
app.use(express.static(path.join(rootDir, "public")));
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "*.cloudinary.com"], // Allow Cloudinary images
      // scriptSrc: ["'self'", "'unsafe-inline'", "*.cloudinary.com"],
      // styleSrc: ["'self'", "'unsafe-inline'"],
      // connectSrc: ["'self'", "*.cloudinary.com"],
      // frameSrc: ["'self'", "*.cloudinary.com"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable if you are embedding resources from other origins
}));

app.use(session({
  secret: "Mern Live Batch",
  saveUninitialized: true,
  resave: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
}));






//Set the view engine
app.set("view engine", "ejs"); //Set the view engine
app.set("views", path.join(rootDir, "views")); //Set the views directory


app.use(bodyparser.urlencoded({ extended: true }));
app.use(storeRouter);
app.use("/auth",authRouter);

app.use((req, res, next) => {
  if (!req.session.isLoggedIn ) {
    return res.redirect('/auth/login');    
  }
  next();
})
app.use('/host', hostRouter);

app.use(errorRouter)


const PORT = process.env.PORT || 3000;
mongoose.connect(MONGO_DB_URL).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.log(error);
})
