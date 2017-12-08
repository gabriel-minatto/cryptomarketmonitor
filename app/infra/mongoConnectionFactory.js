const mongodb = require('mongodb');
/**
 * will reuse connection if already created
 */ 
var createDBConnection = async function(callback, config){
  
  config = config || 
    {dbUser: process.env.dbUser, dbPassword: process.env.dbPassword, dbName : process.env.dbName, server : process.env.dbServer, port : process.env.dbPort};
  
  const url = `mongodb://${config.dbUser}:${config.dbPassword}@${config.server}:${config.port}/${config.dbName}`;
  
  const db = await mongodb.MongoClient.connect(url);
  
  try{
    callback(null, db);
  }
  catch(err){
    callback(err);
  }
  
};

module.exports = function(){
    return createDBConnection;
}