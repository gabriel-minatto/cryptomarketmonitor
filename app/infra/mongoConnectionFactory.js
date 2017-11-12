const mongodb = require('mongodb');
/**
 * will reuse connection if already created
 */ 
var createDBConnection = async function(callback, config){
  
  config = config || {dbName : process.env.dbName, server : process.env.dbServer, port : process.env.dbPort};
  
  var url = `mongodb://${config.server}:${config.port}/${config.dbName}`;
  
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