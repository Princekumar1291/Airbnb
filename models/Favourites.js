const { ObjectId } = require("mongodb");

class Favourites{
  
  constructor(homeId){
    this.homeId=homeId;    
  }

  save(){
    const db=getDb();
    return db.collection('favourites').insertOne(this);
  }

  static fetchAll(){
    const db=getDb();
    return db.collection('favourites').find().toArray();
  }

  static deleteById(homeId){
    const db=getDb();
    return db.collection('favourites').deleteOne({homeId:homeId});
  }

  static findById(homeId){
    const db=getDb();
    return db.collection('favourites').findOne({homeId:homeId});
  }

}


module.exports=Favourites;