const fs=require('fs');
const path=require('path');
const rootDir=require('../utils/path-util');
const favouritesFilePath=path.join(rootDir,'data','favourites.json');

class Favourites{
  
  constructor(){
    this.favourites = [];
  }

  static fetchAll(callback){
    fs.readFile(favouritesFilePath,(err,data)=>{
      if(err){
        callback([]);
      }else{
        if(data.length===0){
          callback([]);
        }
        else callback(JSON.parse(data));
      }
    })
  }

  static addToFavourites(id,callback){
    Favourites.fetchAll((favourites)=>{
      if(favourites.includes(id)){
        callback("Already added to favourites");
        return;
      }
      favourites.push(id);
      fs.writeFile(favouritesFilePath,JSON.stringify(favourites),callback);
    });
  }

  static removeFromFavourites(id,callback){
    Favourites.fetchAll((favourites)=>{
      favourites=favourites.filter(favourite=>favourite!==id);
      fs.writeFile(favouritesFilePath,JSON.stringify(favourites),callback);
    });
  }

}


module.exports=Favourites;