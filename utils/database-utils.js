const mysql2=require('mysql2');
const pool=mysql2.createPool({
  host:'localhost',
  user:'root',
  database:'airbnb',
  password:'Pks@12206676'
});
module.exports=pool.promise();