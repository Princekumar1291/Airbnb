const {MongoClient} = require('mongodb');

const url = "mongodb+srv://princekumar7320918928:pAOc56hFAYtRLPwu@princecluster.ns8if.mongodb.net/airbnb?retryWrites=true&w=majority&appName=PrinceCluster";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(url)
  .then((client) => {
    _db = client.db('airbnb');
    callback();
  })
  .catch(error => {
    console.log('Error came while connecting to mongoDB ');
  });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};


exports.getDb = getDb;
exports.mongoConnect = mongoConnect;