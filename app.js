//Core modules
const path=require('path');

//External modules
const express = require('express');
const app=express();
const bodyparser=require('body-parser');

//Internal modules
const {hostRouter} = require('./router/hostRouter');
const storeRouter = require('./router/storeRouter');
const rootDir = require('./utils/path-util');
const errorRouter = require('./router/errorRouter');

//Middlewares
app.use(express.static(path.join(rootDir,"public")));

//Set the view engine
app.set("view engine","ejs"); //Set the view engine
app.set("views",path.join(rootDir,"views")); //Set the views directory

app.use(bodyparser.urlencoded({extended:false}));
app.use(storeRouter);
app.use('/host',hostRouter); 
app.use(errorRouter)

const PORT=3000;
const {mongoConnect}=require('./utils/database-utils');

mongoConnect(()=>{
  app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
  })
}) 