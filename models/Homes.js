const fs=require('fs');
const path=require('path');
const rootDir=require('../utils/path-util');
const homeFilePath=path.join(rootDir,'data','homes.json');



class Homes{
  constructor(houseName,price,location,description,rating,photoUrl){
    this.houseName=houseName;
    this.price=price;
    this.location=location;
    this.rating=rating;
    this.description=description;
    this.photoUrl=photoUrl;
  }
  save(callback){
    Homes.fetchall((registerHomes)=>{
      registerHomes.push(this);
      fs.writeFile(homeFilePath,JSON.stringify(registerHomes),callback);
    });
  }

  static fetchall(callback){
    fs.readFile(homeFilePath,(err,data)=>{
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
} 

module.exports=Homes;