const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/database-utils');

class Homes {
  constructor(houseName, price, location, description, rating, photoUrl) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.description = description;
    this.photoUrl = photoUrl;
  }

  save() {
    const db = getDb();
    return db.collection('homes').insertOne(this);
  }

  static fetchall() {
    const db=getDb();
    return db.collection('homes').find().toArray();
  }

  static findById(_id) {
    const db=getDb();
    const objectId = new ObjectId(_id);
    return db.collection('homes').findOne({_id:objectId});
  }

  static deleteById(_id) {
    const db=getDb();
    const objectId = new ObjectId(_id);
    return db.collection('homes').deleteOne({_id:objectId});
  }

  static updateById(_id,houseName,price,location,description,rating,photoUrl) {
    const db=getDb();
    const objectId = new ObjectId(_id);
    return db.collection('homes').updateOne({_id:objectId},{$set:{houseName:houseName,price:price,location:location,description:description,rating:rating,photoUrl:photoUrl}}); 
  }


}

module.exports = Homes;